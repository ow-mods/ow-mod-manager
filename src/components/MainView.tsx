import React, { useState } from 'react';
import { Container, Tabs, Tab, CssBaseline } from '@material-ui/core';

import Mods from './Mods';
import Settings from './Settings';
import Logs from './Logs';
import TopBar from './TopBar';
import LoadingBar from './LoadingBar';

enum AppTab {
  Mods,
  Logs,
  Settings,
}

const MainView = () => {
  const [tab, setTab] = useState<AppTab>(AppTab.Mods);

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={tab} onChange={(event, index) => setTab(index)}>
          <Tab label="Mods" value={AppTab.Mods} />
          <Tab label="Logs" value={AppTab.Logs} />
          <Tab label="Settings" value={AppTab.Settings} />
        </Tabs>
      </TopBar>
      <LoadingBar />
      <Container>
        {tab === AppTab.Logs && <Logs />}
        {tab === AppTab.Mods && <Mods />}
        {tab === AppTab.Settings && <Settings />}
      </Container>
    </CssBaseline>
  );
};

export default MainView;
