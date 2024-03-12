import styled from '@emotion/styled';
import { memo } from 'react';
import { GridConfigDropdownButton } from '../features/grid-config/GridConfigDropdown';
import { ParamEditor, ParamEditorsTable } from '../features/params-editor/ParamEditor';
import { ParamModel } from '../model/ParamModel';
import { useRenderedTheme } from '../model/rendered-theme';
import { CopyButton } from './CopyButton';
import { DiscardChangesButton } from './DiscardChangesButton';
import { GridPreview } from './GridPreview';

export const RootContainer = memo(() => {
  const theme = useRenderedTheme();
  return (
    <Container>
      <Grid>
        <Header>
          <GridConfigDropdownButton />
          <Spacer />
          <CopyButton getText={() => theme.css}>Copy CSS</CopyButton>
          <DiscardChangesButton />
        </Header>
        <Menu>
          <ParamEditorsTable>
            <ParamEditor param={ParamModel.for('foregroundColor')} />
            <ParamEditor param={ParamModel.for('backgroundColor')} />
            <ParamEditor param={ParamModel.for('accentColor')} />
          </ParamEditorsTable>
        </Menu>
        <Main>
          <GridPreview />
        </Main>
      </Grid>
    </Container>
  );
});

const Container = styled('div')`
  padding: 8px;
  height: 100%;
`;

const Grid = styled('div')`
  height: 100%;
  display: grid;
  grid-template-areas:
    'header header'
    'menu main';
  grid-template-columns: 400px auto;
  grid-template-rows: min-content auto;
  gap: 20px;

  font-family: 'IBM Plex Sans', sans-serif;

  .tooltip {
    max-width: 400px;
  }
`;

const Header = styled('div')`
  grid-area: header;
  display: flex;
  gap: 16px;
`;

const Spacer = styled('div')`
  flex-grow: 1;
`;

const Menu = styled('div')`
  grid-area: menu;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Main = styled('div')`
  grid-area: main;
`;
