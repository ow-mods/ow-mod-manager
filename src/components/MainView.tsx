import React, { useState } from 'react';
import { Container, Tabs, Tab, CssBaseline } from '@material-ui/core';

import ModTable from './Mods';
import TopBar from './TopBar';
import LoadingBar from './LoadingBar';
import OwmlLog from './Logs';

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
          <Tab label="Mods" value={AppTab.Mods} />
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
