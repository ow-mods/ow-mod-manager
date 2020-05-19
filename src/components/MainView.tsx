import React, { useState } from 'react';
import { Container, Tabs, Tab, CssBaseline } from '@material-ui/core';

import ModTable from './ModList';
import TopBar from './TopBar';
import LoadingBar from './LoadingBar';
import OwmlLog from './ConsoleLog';

enum AppTab {
  Mods,
  Logs,
}

const MainView = () => {
  const [tab, setTab] = useState<AppTab>(AppTab.Mods);

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={tab} onChange={(event, index) => setTab(index)}>
          <Tab label="Mods" value={AppTab.All} />
          <Tab label="Logs" value={AppTab.Logs} />
        </Tabs>
      </TopBar>
      <LoadingBar />
      <Container>
        {tab === AppTab.Logs && <OwmlLog />}
        {tab === AppTab.Mods && <ModTable />}
      </Container>
    </CssBaseline>
  );
};

export default MainView;
