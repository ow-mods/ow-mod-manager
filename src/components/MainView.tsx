import React, { useState } from 'react';
import { Container, Tabs, Tab } from '@material-ui/core';

import { isInstalled } from '../services';
import ModList from './ModList';
import TopBar from './TopBar';
import LoadingBar from './LoadingBar';
import OwmlLog from './ConsoleLog';

enum AppTab {
  Installed,
  All,
  New,
  Logs,
}

const getTabFilter = (tab: AppTab) => {
  switch (tab) {
    case AppTab.Installed: {
      return isInstalled;
    }
    case AppTab.New: {
      return (mod: Mod) => !isInstalled(mod);
    }
    default: {
      return () => true;
    }
  }
};

const MainView = () => {
  const [tab, setTab] = useState<AppTab>(AppTab.All);

  return (
    <>
      <TopBar>
        <Tabs value={tab} onChange={(event, index) => setTab(index)}>
          <Tab label="All" value={AppTab.All} />
          <Tab label="Installed" value={AppTab.Installed} />
          <Tab label="Not Installed" value={AppTab.New} />
          <Tab label="Logs" value={AppTab.Logs} />
        </Tabs>
      </TopBar>
      <Container>
        {tab === AppTab.Logs && <OwmlLog />}
        {tab !== AppTab.Logs && <ModList filter={getTabFilter(tab)} />}
        <LoadingBar />
      </Container>
    </>
  );
};

export default MainView;
