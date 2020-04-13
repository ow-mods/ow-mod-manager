import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Container, Tabs, Tab } from '@material-ui/core';
import { green, orange } from '@material-ui/core/colors';

import { AppStateProvider } from './AppState';
import ModList from './ModList';
import TopBar from './TopBar';
import { isInstalled } from '../services/mod-manager';
import LoadingBar from './LoadingBar';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: green[700],
    },
    secondary: {
      main: orange[800],
    },
  },
});

enum AppTab {
  Installed,
  All,
  New,
}

const getTabFilter = (tab: AppTab) => {
  switch (tab) {
    case AppTab.Installed: {
      return isInstalled;
    }
    case AppTab.All: {
      return () => true;
    }
    case AppTab.New: {
      return (mod: Mod) => !isInstalled(mod);
    }
  }
};

const App = () => {
  const [tab, setTab] = useState<AppTab>(AppTab.All);

  return (
    <AppStateProvider>
      <ThemeProvider theme={theme}>
        <TopBar>
          <Tabs value={tab} onChange={(event, index) => setTab(index)}>
            <Tab label="All" value={AppTab.All} />
            <Tab label="Installed" value={AppTab.Installed} />
            <Tab label="New" value={AppTab.New} />
          </Tabs>
        </TopBar>
        <Container>
          <ModList filter={getTabFilter(tab)} />
          <LoadingBar />
        </Container>
      </ThemeProvider>
    </AppStateProvider>
  );
};

export default hot(App);
