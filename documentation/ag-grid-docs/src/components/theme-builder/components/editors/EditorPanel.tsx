import { ChevronDown } from '@carbon/icons-react';
import styled from '@emotion/styled';
import * as Accordion from '@radix-ui/react-accordion';
import { type ReactNode } from 'react';

import { ParamEditor } from './ParamEditor';
import { PartEditor } from './PartEditor';

export const EditorPanel = () => {
    return (
        <AccordionRoot type="multiple" defaultValue={['General']}>
            <Section heading="General">
                <LeftBiasRow>
                    <ParamEditor param="fontFamily" />
                    <ParamEditor param="fontSize" />
                </LeftBiasRow>
                <ParamEditor param="backgroundColor" />
                <ParamEditor param="foregroundColor" />
                <ParamEditor param="accentColor" />
                <ParamEditor param="gridSize" label="Spacing" showDocs />
                <EvenSplitRow>
                    <ParamEditor param="wrapperBorderRadius" label="Wrapper radius" showDocs />
                    <ParamEditor param="borderRadius" label="Widget radius" showDocs />
                </EvenSplitRow>
            </Section>
            <Section heading="Header">
                <ParamEditor param="headerVerticalAdjust" label="Vertical size" />
                <ParamEditor param="headerBackgroundColor" label="Background color" />
                <ParamEditor param="headerForegroundColor" label="Foreground color" />
                <LeftBiasRow>
                    <ParamEditor param="headerFontFamily" label="Font family" />
                    <ParamEditor param="headerFontSize" label="Font size" />
                </LeftBiasRow>
                <ParamEditor param="headerFontWeight" label="Font weight" />
            </Section>
            <Section heading="Cells">
                <ParamEditor param="oddRowBackgroundColor" label="Odd row background" />
                <ParamEditor param="rowVerticalAdjust" label="Adjust height" />
                <ParamEditor param="rowHorizontalAdjust" label="Adjust horizontal padding" />
            </Section>
            <Section heading="Icons">
                <PartEditor part="iconSet" />
                <ParamEditor param="iconSize" label="Size" />
            </Section>
        </AccordionRoot>
    );
};

const Section = (props: { heading: string; children: ReactNode }) => (
    <AccordionItem value={props.heading}>
        <AccordionHeader>
            <Trigger>
                {props.heading} <OpenCloseChevron />
            </Trigger>
        </AccordionHeader>
        <AccordionContent>
            <SectionContent>{props.children}</SectionContent>
        </AccordionContent>
    </AccordionItem>
);

const SectionContent = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-bottom: 32px;
`;

const AccordionRoot = styled(Accordion.Root)`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const AccordionItem = styled(Accordion.Item)`
    margin: 0;
`;

const AccordionHeader = styled(Accordion.Header)`
    margin-bottom: 16px;
    padding-left: 6px;
    padding-right: 10px;
`;

const AccordionContent = styled(Accordion.Content)`
    overflow: hidden;
    margin: 0;
    padding-left: 6px;
    padding-right: 10px;

    &[data-state='open'] {
        animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards;
    }

    &[data-state='closed'] {
        animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards;
    }

    @keyframes slideDown {
        from {
            height: 0;
        }
        to {
            height: var(--radix-accordion-content-height);
        }
    }

    @keyframes slideUp {
        from {
            height: var(--radix-accordion-content-height);
        }
        to {
            height: 0;
        }
    }
`;

const Trigger = styled(Accordion.Trigger)`
    all: unset;
    color: var(--color-fg-primary) !important;
    background: none !important;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
`;

const EvenSplitRow = styled('div')`
    display: flex;
    gap: 12px;
    > * {
        flex: 1;
    }
`;

const LeftBiasRow = styled('div')`
    display: flex;
    gap: 12px;
    > :nth-of-type(1) {
        flex: 2;
    }
    > :nth-of-type(2) {
        flex: 1;
    }
`;

const OpenCloseChevron = styled(ChevronDown)`
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
    [data-state='open'] & {
        transform: rotate(180deg);
    }
`;
