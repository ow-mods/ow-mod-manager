import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Button, Container, Tabs, Tab, makeStyles } from '@material-ui/core';

import runOwml from '../services/run-owml';
import { AppStateProvider, useAppState } from './AppState';
import ModList from './ModList';
import TopBar from './TopBar';
import { isInstalled } from '../services/mod-manager';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles({
  right: {
    position: 'absolute',
    right: 0,
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
  const [tab, setTab] = useState<AppTab>(AppTab.Installed);
  const [isInstallTabDisabled, setIsInstallTabDisabled] = useState(false);
  const classes = useStyles();
  const { localModMap } = useAppState();

  useEffect(() => {
    if (tab === AppTab.Installed && Object.keys(localModMap).length === 0) {
      setTab(AppTab.All);
      setIsInstallTabDisabled(true);
    } else {
      setIsInstallTabDisabled(false);
    }
  }, [localModMap]);

  return (
    <AppStateProvider>
      <ThemeProvider theme={theme}>
        <TopBar>
          <Tabs value={tab} onChange={(event, index) => setTab(index)}>
            <Tab
              label="Installed"
              value={AppTab.Installed}
              disabled={isInstallTabDisabled}
            />
            <Tab label="All" value={AppTab.All} />
            <Tab label="New" value={AppTab.New} />
            <Button
              onClick={runOwml}
              size="large"
              variant="contained"
              color="primary"
              className={classes.right}
            >
              Start Game
            </Button>
          </Tabs>
        </TopBar>
        <Container>
          <ModList filter={getTabFilter(tab)} />
        </Container>
      </ThemeProvider>
    </AppStateProvider>
  );
};

export default hot(App);
