import type {
    AgColumn,
    BeanCollection,
    ChangedPath,
    GetDataPath,
    IRowNodeStage,
    ISelectionService,
    IShowRowGroupColsService,
    InitialGroupOrderComparatorParams,
    IsGroupOpenByDefaultParams,
    RowNodeTransaction,
    StageExecuteParams,
    WithoutGridCommon,
} from '@ag-grid-community/core';
import {
    BeanStub,
    RowNode,
    _areEqual,
    _existsAndNotEmpty,
    _removeFromArray,
    _sortRowNodesByOrder,
    _warnOnce,
} from '@ag-grid-community/core';

import { BatchRemover } from '../batchRemover';

interface TreeGroupingDetails {
    expandByDefault: number;
    changedPath: ChangedPath;
    rootNode: RowNode;
    transactions: RowNodeTransaction[];
    rowNodeOrder: { [id: string]: number };

    isGroupOpenByDefault: (params: WithoutGridCommon<IsGroupOpenByDefaultParams>) => boolean;
    initialGroupOrderComparator: (params: WithoutGridCommon<InitialGroupOrderComparatorParams>) => number;

    suppressGroupMaintainValueType: boolean;
    getDataPath: GetDataPath | undefined;
}

interface GroupInfo {
    key: string; // e.g. 'Ireland'
    field: string | null; // e.g. 'country'
    rowGroupColumn: AgColumn | null;
    leafNode?: RowNode;
}

type CacheTree = Record<string, TreeNode | undefined>;

interface TreeNode {
    row: RowNode | null;
    subtree: CacheTree;
}

export class TreeStrategy extends BeanStub implements IRowNodeStage {
    private beans: BeanCollection;
    private selectionService: ISelectionService;
    private showRowGroupColsService: IShowRowGroupColsService;

    public wireBeans(beans: BeanCollection) {
        this.beans = beans;
        this.selectionService = beans.selectionService;
        this.showRowGroupColsService = beans.showRowGroupColsService!;
    }

    private oldGroupDisplayColIds: string;

    /** Hierarchical node cache to speed up tree data node insertion */
    private cache: CacheTree = Object.create(null);

    public execute(params: StageExecuteParams): void {
        const details = this.createGroupingDetails(params);

        if (details.transactions) {
            this.handleTransaction(details);
        } else {
            const afterColsChanged = params.afterColumnsChanged === true;
            this.shotgunResetEverything(details, afterColsChanged);
        }
    }

    private cacheTraverse(path: string[], level: number): CacheTree {
        let cache = this.cache;
        let i = 0;

        while (i <= level) {
            const key = path[i];

            let node = cache[key];
            if (!node) {
                node = { row: null, subtree: Object.create(null) };
                cache[key] = node;
            }
            cache = node.subtree;

            i++;
        }

        return cache;
    }

    public cacheAdd(path: string[], level: number, key: string, row: RowNode | null): void {
        const cache = this.cacheTraverse(path, level - 1);
        let node = cache[key];
        if (!node) {
            node = { row, subtree: Object.create(null) };
            cache[key] = node;
        } else if (row) {
            node.row = row; // Override the row only if not null
        }
    }

    public cacheGet(path: string[], level: number, key: string): RowNode | null | undefined {
        const cache = this.cacheTraverse(path, level - 1);
        return cache[key]?.row;
    }

    private createGroupingDetails(params: StageExecuteParams): TreeGroupingDetails {
        const { rowNode, changedPath, rowNodeTransactions, rowNodeOrder } = params;

        const details: TreeGroupingDetails = {
            expandByDefault: this.gos.get('groupDefaultExpanded'),
            rootNode: rowNode,
            rowNodeOrder: rowNodeOrder!,
            transactions: rowNodeTransactions!,
            // if no transaction, then it's shotgun, changed path would be 'not active' at this point anyway
            changedPath: changedPath!,
            isGroupOpenByDefault: this.gos.getCallback('isGroupOpenByDefault') as any,
            initialGroupOrderComparator: this.gos.getCallback('initialGroupOrderComparator') as any,
            suppressGroupMaintainValueType: this.gos.get('suppressGroupMaintainValueType'),
            getDataPath: this.gos.get('getDataPath'),
        };

        return details;
    }

    private handleTransaction(details: TreeGroupingDetails): void {
        // we don't allow batch remover for tree data as tree data uses Filler Nodes,
        // and creating/deleting filler nodes needs to be done alongside the node deleting
        // and moving. if we want to Batch Remover working with tree data then would need
        // to consider how Filler Nodes would be impacted (it's possible that it can be easily
        // modified to work, however for now I don't have the brain energy to work it all out).

        details.transactions.forEach((tran) => {
            // the order here of [add, remove, update] needs to be the same as in ClientSideNodeManager,
            // as the order is important when a record with the same id is added and removed in the same
            // transaction.
            if (_existsAndNotEmpty(tran.remove)) {
                this.removeNodes(tran.remove as RowNode[], details);
            }
            if (_existsAndNotEmpty(tran.update)) {
                this.moveNodesInWrongPath(tran.update as RowNode[], details);
            }
            if (_existsAndNotEmpty(tran.add)) {
                this.insertNodes(tran.add as RowNode[], details);
            }
        });

        if (details.rowNodeOrder) {
            this.sortChildren(details);
        }
    }

    // this is used when doing delta updates, eg Redux, keeps nodes in right order
    private sortChildren(details: TreeGroupingDetails): void {
        details.changedPath.forEachChangedNodeDepthFirst(
            (node) => {
                const didSort = _sortRowNodesByOrder(node.childrenAfterGroup, details.rowNodeOrder);
                if (didSort) {
                    details.changedPath.addParentNode(node);
                }
            },
            false,
            true
        );
    }

    private getExistingPathForNode(node: RowNode, details: TreeGroupingDetails): string[] {
        const res: string[] = [];

        // the node is part of the path
        let pointer: RowNode | null = node;
        while (pointer && pointer !== details.rootNode) {
            res.push(pointer.key!);
            pointer = pointer.parent;
        }
        res.reverse();
        return res;
    }

    private moveNodesInWrongPath(childNodes: RowNode[], details: TreeGroupingDetails): void {
        const sorted = topologicalSort(childNodes, details);
        for (const childNode of sorted) {
            // we add node, even if parent has not changed, as the data could have
            // changed, hence aggregations will be wrong
            if (details.changedPath.isActive()) {
                details.changedPath.addParentNode(childNode.parent);
            }

            const oldPath: string[] = this.getExistingPathForNode(childNode, details);
            const newPath: string[] = this.getDataPath(childNode, details);

            const nodeInCorrectPath = _areEqual(oldPath, newPath);

            if (!nodeInCorrectPath) {
                this.moveNode(childNode, details);
            }
        }
    }

    private moveNode(childNode: RowNode, details: TreeGroupingDetails): void {
        this.removeNodesInStages([childNode], details);
        this.insertOneNode(childNode, details, true);

        // hack - if we didn't do this, then renaming a tree item (ie changing rowNode.key) wouldn't get
        // refreshed into the gui.
        // this is needed to kick off the event that rowComp listens to for refresh. this in turn
        // then will get each cell in the row to refresh - which is what we need as we don't know which
        // columns will be displaying the rowNode.key info.
        childNode.setData(childNode.data);

        // we add both old and new parents to changed path, as both will need to be refreshed.
        // we already added the old parent (in calling method), so just add the new parent here
        if (details.changedPath.isActive()) {
            const newParent = childNode.parent;
            details.changedPath.addParentNode(newParent);
        }
    }

    private removeNodes(leafRowNodes: RowNode[], details: TreeGroupingDetails): void {
        this.removeNodesInStages(leafRowNodes, details);
        if (details.changedPath.isActive()) {
            leafRowNodes.forEach((rowNode) => details.changedPath.addParentNode(rowNode.parent));
        }
    }

    private removeNodesInStages(leafRowNodes: RowNode[], details: TreeGroupingDetails): void {
        const batchRemover = new BatchRemover();

        leafRowNodes.forEach((nodeToRemove) => {
            this.removeFromParent(nodeToRemove, batchRemover);

            // remove from allLeafChildren. we clear down all parents EXCEPT the Root Node, as
            // the ClientSideNodeManager is responsible for the Root Node.
            this.forEachParentGroup(details, nodeToRemove.parent!, (parentNode) => {
                batchRemover.removeFromAllLeafChildren(parentNode, nodeToRemove);
            });
        });

        batchRemover.flush();

        // For TreeData, there is no BatchRemover, so we have to call removeEmptyGroups here.
        const nodeParents = leafRowNodes.map((n) => n.parent!);
        this.removeEmptyGroups(nodeParents, details);
    }

    private forEachParentGroup(
        details: TreeGroupingDetails,
        group: RowNode,
        callback: (parent: RowNode) => void
    ): void {
        let pointer: RowNode | null = group;
        while (pointer && pointer !== details.rootNode) {
            callback(pointer);
            pointer = pointer.parent;
        }
    }

    private removeEmptyGroups(possibleEmptyGroups: RowNode[], details: TreeGroupingDetails): void {
        // we do this multiple times, as when we remove groups, that means the parent of just removed
        // group can then be empty. to get around this, if we remove, then we check everything again for
        // newly emptied groups. the max number of times this will execute is the depth of the group tree.
        let checkAgain = true;

        const groupShouldBeRemoved = (rowNode: RowNode): boolean => {
            // because of the while loop below, it's possible we already moved the node,
            // so double check before trying to remove again.
            const mapKey = this.getChildrenMappedKey(rowNode.key!, rowNode.rowGroupColumn);
            const parentRowNode = rowNode.parent;
            const groupAlreadyRemoved = parentRowNode?.childrenMapped ? !parentRowNode.childrenMapped[mapKey] : true;

            if (groupAlreadyRemoved) {
                // if not linked, then group was already removed
                return false;
            }
            // if still not removed, then we remove if this group is empty
            return rowNode.isEmptyRowGroupNode();
        };

        while (checkAgain) {
            checkAgain = false;
            const batchRemover = new BatchRemover();
            possibleEmptyGroups.forEach((possibleEmptyGroup) => {
                // remove empty groups
                this.forEachParentGroup(details, possibleEmptyGroup, (rowNode) => {
                    if (groupShouldBeRemoved(rowNode)) {
                        if (rowNode.data && details.getDataPath?.(rowNode.data)) {
                            // This node has associated tree data so shouldn't be removed, but should no longer be
                            // marked as a group if it has no children.
                            rowNode.setGroup(
                                (rowNode.childrenAfterGroup && rowNode.childrenAfterGroup.length > 0) ?? false
                            );
                        } else {
                            checkAgain = true;

                            this.removeFromParent(rowNode, batchRemover);
                            // we remove selection on filler nodes here, as the selection would not be removed
                            // from the RowNodeManager, as filler nodes don't exist on the RowNodeManager
                            rowNode.setSelectedParams({ newValue: false, source: 'rowGroupChanged' });
                        }
                    }
                });
            });
            batchRemover.flush();
        }
    }

    // removes the node from the parent by:
    // a) removing from childrenAfterGroup (using batchRemover if present, otherwise immediately)
    // b) removing from childrenMapped (immediately)
    // c) setRowTop(null) - as the rowRenderer uses this to know the RowNode is no longer needed
    // d) setRowIndex(null) - as the rowNode will no longer be displayed.
    private removeFromParent(child: RowNode, batchRemover?: BatchRemover) {
        if (child.parent) {
            if (batchRemover) {
                batchRemover.removeFromChildrenAfterGroup(child.parent, child);
            } else {
                _removeFromArray(child.parent.childrenAfterGroup!, child);
                child.parent.updateHasChildren();
            }
        }
        const mapKey = this.getChildrenMappedKey(child.key!, child.rowGroupColumn);
        if (child.parent?.childrenMapped != undefined) {
            delete child.parent.childrenMapped[mapKey];
        }
        // this is important for transition, see rowComp removeFirstPassFuncs. when doing animation and
        // remove, if rowTop is still present, the rowComp thinks it's just moved position.
        child.setRowTop(null);
        child.setRowIndex(null);
    }

    /**
     * This is idempotent, but relies on the `key` field being the same throughout a RowNode's lifetime
     */
    private addToParent(child: RowNode, parent: RowNode | null) {
        const mapKey = this.getChildrenMappedKey(child.key!, child.rowGroupColumn);
        if (parent?.childrenMapped != null) {
            if (parent?.childrenMapped?.[mapKey] !== child) {
                parent.childrenMapped[mapKey] = child;
                parent.childrenAfterGroup!.push(child);
                parent.setGroup(true); // calls `.updateHasChildren` internally
            }
        }
    }

    private checkAllGroupDataAfterColsChanged(details: TreeGroupingDetails): void {
        const recurse = (rowNodes: RowNode[] | null) => {
            if (!rowNodes) {
                return;
            }
            rowNodes.forEach((rowNode) => {
                const groupInfo: GroupInfo = {
                    field: rowNode.field,
                    key: rowNode.key!,
                    rowGroupColumn: rowNode.rowGroupColumn,
                    leafNode: rowNode.allLeafChildren?.[0],
                };
                this.setGroupData(rowNode, groupInfo);
                recurse(rowNode.childrenAfterGroup);
            });
        };

        recurse(details.rootNode.childrenAfterGroup);
    }

    private shotgunResetEverything(details: TreeGroupingDetails, afterColumnsChanged: boolean): void {
        if (this.noChangeInGroupingColumns(details, afterColumnsChanged)) {
            return;
        }

        // groups are about to get disposed, so need to deselect any that are selected
        this.selectionService.filterFromSelection((node: RowNode) => node && !node.group);

        const { rootNode } = details;
        // set .leafGroup always to false for tree data, as .leafGroup is only used when pivoting, and pivoting
        // isn't allowed with treeData, so the grid never actually use .leafGroup when doing treeData.
        rootNode.leafGroup = false;

        // we are doing everything from scratch, so reset childrenAfterGroup and childrenMapped from the rootNode
        rootNode.childrenAfterGroup = [];
        rootNode.childrenMapped = {};
        rootNode.updateHasChildren();

        const sibling = rootNode.sibling;
        if (sibling) {
            sibling.childrenAfterGroup = rootNode.childrenAfterGroup;
            sibling.childrenMapped = rootNode.childrenMapped;
        }

        this.insertNodes(rootNode.allLeafChildren!, details);
    }

    private noChangeInGroupingColumns(details: TreeGroupingDetails, afterColumnsChanged: boolean): boolean {
        const groupDisplayColumns = this.showRowGroupColsService.getShowRowGroupCols();
        const newGroupDisplayColIds = groupDisplayColumns ? groupDisplayColumns.map((c) => c.getId()).join('-') : '';

        if (afterColumnsChanged) {
            // if the group display cols have changed, then we need to update rowNode.groupData
            // (regardless of tree data or row grouping)
            if (this.oldGroupDisplayColIds !== newGroupDisplayColIds) {
                this.checkAllGroupDataAfterColsChanged(details);
            }
        }

        this.oldGroupDisplayColIds = newGroupDisplayColIds;

        return afterColumnsChanged;
    }

    private insertNodes(newRowNodes: RowNode[], details: TreeGroupingDetails): void {
        this.buildNodeCacheFromRows(newRowNodes, details);

        newRowNodes.forEach((rowNode) => {
            this.insertOneNode(rowNode, details, false);
            if (details.changedPath.isActive()) {
                details.changedPath.addParentNode(rowNode.parent);
            }
        });
    }

    private insertOneNode(
        childNode: RowNode,
        details: TreeGroupingDetails,
        isMove: boolean,
        batchRemover?: BatchRemover
    ): void {
        const path = this.getDataPath(childNode, details);
        const level = path.length - 1;
        const key = path[level];

        let parentGroup = details.rootNode;
        for (let level = 0, stopLevel = path.length - 1; level < stopLevel; ++level) {
            const key = path[level];

            let row = parentGroup?.childrenMapped?.[key];

            if (!row) {
                row = this.cacheGet(path, level, key);
                if (row) {
                    row.parent = parentGroup;
                } else {
                    row = this.createGroup(key, parentGroup, level, details);
                }
                // attach the new group to the parent
                this.addToParent(row, parentGroup);
            }

            parentGroup = row;

            // node gets added to all group nodes.
            // note: we do not add to rootNode here, as the rootNode is the master list of rowNodes

            if (!batchRemover?.isRemoveFromAllLeafChildren(parentGroup, childNode)) {
                parentGroup.allLeafChildren!.push(childNode);
            } else {
                // if this node is about to be removed, prevent that
                batchRemover?.preventRemoveFromAllLeafChildren(parentGroup, childNode);
            }
        }

        // todo fix this slow path
        const existingNode = parentGroup.childrenAfterGroup?.find((node) => node.key === childNode.key);
        if (existingNode) {
            _warnOnce(`duplicate group keys for row data, keys should be unique`, [existingNode.data, childNode.data]);
            return;
        }

        childNode.parent = parentGroup;
        childNode.level = level + 1;
        this.ensureRowNodeFields(childNode, key);
        this.setGroupData(childNode, { key, field: null, rowGroupColumn: null });
        // AG-3441 - only set initial value if node is not being moved
        if (!isMove) {
            this.setExpandedInitialValue(details, childNode);
        }
        this.addToParent(childNode, parentGroup);
    }

    /**
     * Directly re-initialises the `TreeDataNodeCache`
     */
    private buildNodeCacheFromRows(rowNodes: RowNode[], details: TreeGroupingDetails): void {
        let width = 0;
        const paths = rowNodes.map((node) => {
            const path = this.getDataPath(node, details);
            if (width < path.length) {
                width = path.length;
            }
            return path;
        });

        this.cache = Object.create(null); // Clear the cache

        // Iterate through the paths level-by-level, populating the cache with RowNode
        // instances for all leaves of the hierarchy, and nulls otherwise (to be backfilled
        // with filler nodes in the subsequent step)
        for (let level = 0; level < width; level++) {
            for (let rowIdx = 0; rowIdx < paths.length; rowIdx++) {
                const path = paths[rowIdx];
                const isLeaf = path[level + 1] === undefined;

                if (path[level] === undefined) {
                    continue;
                }

                const key = path[level];

                this.cacheAdd(path, level, key, isLeaf ? rowNodes[rowIdx] : null);
                if (isLeaf) {
                    this.ensureRowNodeFields(rowNodes[rowIdx], key);
                }
            }
        }

        this.backfillGroups(this.cache, details.rootNode, 0, details);
    }

    private ensureRowNodeFields(rowNode: RowNode, key?: string): RowNode {
        if (key !== undefined) {
            rowNode.key = key;
        }
        rowNode.childrenMapped ??= {};
        rowNode.allLeafChildren ??= [];
        rowNode.childrenAfterGroup ??= [];
        return rowNode;
    }

    /** Walks the Tree recursively and backfills `null` entries with filler group nodes */
    private backfillGroups(cache: CacheTree, parent: RowNode, level: number, details: TreeGroupingDetails): void {
        for (const key in cache) {
            const value = cache[key];
            if (value) {
                if (value.row === null) {
                    value.row = this.createGroup(key, parent, level, details);
                }
                this.backfillGroups(value.subtree, value.row, level + 1, details);
            }
        }
    }

    private createGroup(key: string, parent: RowNode, level: number, details: TreeGroupingDetails): RowNode {
        const groupNode = new RowNode(this.beans);

        groupNode.group = true;
        groupNode.field = null;

        this.setGroupData(groupNode, {
            key,
            field: null,
            rowGroupColumn: null,
        });

        groupNode.key = key;

        // we put 'row-group-' before the group id, so it doesn't clash with standard row id's. we also use 't-' and 'b-'
        // for top pinned and bottom pinned rows.
        groupNode.id = RowNode.ID_PREFIX_ROW_GROUP + this.createGroupIdEnd(groupNode, parent, level);

        groupNode.level = level;
        groupNode.leafGroup = false;

        groupNode.allLeafChildren = [];

        // why is this done here? we are not updating the children count as we go,
        // i suspect this is updated in the filter stage
        groupNode.setAllChildrenCount(0);

        groupNode.rowGroupIndex = null;

        groupNode.childrenAfterGroup = [];
        groupNode.childrenMapped = {};
        groupNode.updateHasChildren();

        groupNode.parent = parent;

        this.setExpandedInitialValue(details, groupNode);

        return groupNode;
    }

    private createGroupIdEnd(node: RowNode, parent: RowNode | null, level: number): string | null {
        if (level < 0) {
            return null;
        } // root node
        const parentId = parent ? this.createGroupIdEnd(parent, parent.parent, level - 1) : null;
        return `${parentId == null ? '' : parentId + '-'}${level}-${node.key}`;
    }

    private setGroupData(groupNode: RowNode, groupInfo: GroupInfo): void {
        groupNode.groupData = {};
        const groupDisplayCols = this.showRowGroupColsService.getShowRowGroupCols();
        groupDisplayCols.forEach((col) => {
            // newGroup.rowGroupColumn=null when working off GroupInfo, and we always display the group in the group column
            // if rowGroupColumn is present, then it's grid row grouping and we only include if configuration says so

            groupNode.groupData![col.getColId()] = groupInfo.key;
        });
    }

    private getChildrenMappedKey(key: string, rowGroupColumn: AgColumn | null): string {
        return rowGroupColumn ? rowGroupColumn.getId() + '-' + key : key;
    }

    private setExpandedInitialValue(details: TreeGroupingDetails, groupNode: RowNode): void {
        // use callback if exists
        const userCallback = details.isGroupOpenByDefault;
        if (userCallback) {
            const params: WithoutGridCommon<IsGroupOpenByDefaultParams> = {
                rowNode: groupNode,
                field: groupNode.field!,
                key: groupNode.key!,
                level: groupNode.level,
                rowGroupColumn: groupNode.rowGroupColumn!,
            };
            groupNode.expanded = userCallback(params) == true;
            return;
        }

        // use expandByDefault if exists
        if (details.expandByDefault === -1) {
            groupNode.expanded = true;
            return;
        }

        // otherwise
        groupNode.expanded = groupNode.level < details.expandByDefault;
    }

    private getDataPath({ data }: RowNode, { getDataPath }: TreeGroupingDetails): string[] {
        const keys = getDataPath?.(data) || [];
        if (!keys.length) {
            _warnOnce(`getDataPath() should not return an empty path for data ${data}`);
        }
        return keys;
    }
}

/**
 * Topological sort of the given row nodes based on the grouping hierarchy, where parents come before children.
 * Used to ensure tree data is moved in the correct order (see AG-11678)
 */
function topologicalSort(rowNodes: RowNode[], details: TreeGroupingDetails): RowNode[] {
    const sortedNodes: RowNode[] = [];
    // performance: create a cache of ids to make lookups during the search faster
    const idLookup = Object.fromEntries(rowNodes.map<[string, number]>((node, i) => [node.id!, i]));
    // performance: keep track of the nodes we haven't found yet so we can return early
    const stillToFind = new Set(Object.keys(idLookup));

    const queue = [details.rootNode];
    let i = 0;

    // BFS for nodes in the hierarchy that match IDs of the given nodes
    while (i < queue.length) {
        // performance: indexing into the array instead of using e.g. `.shift` is _much_ faster
        const node = queue[i];
        i++;
        if (node === undefined) {
            continue;
        }

        if (node.id && node.id in idLookup) {
            sortedNodes.push(rowNodes[idLookup[node.id]]);
            stillToFind.delete(node.id);
        }

        // we can stop early if we've already found all the nodes
        if (stillToFind.size === 0) {
            return sortedNodes;
        }

        const children = node.childrenAfterGroup ?? [];
        for (let i = 0; i < children.length; i++) {
            queue.push(children[i]);
        }
    }

    return sortedNodes;
}
