import React, { useState } from 'react';
import {
  Container,
  Tabs,
  Tab,
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import {
  Build as BuildIcon,
  Dvr as DvrIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

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

const useStyles = makeStyles({
  root: {
    minHeight: 0,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

const MainView = () => {
  const styles = useStyles();
  const [tab, setTab] = useState<AppTab>(AppTab.Mods);

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={tab} onChange={(event, index) => setTab(index)}>
          <Tab
            classes={styles}
            icon={<BuildIcon />}
            label="Mods"
            value={AppTab.Mods}
          />
          <Tab
            classes={styles}
            icon={<DvrIcon />}
            label="Logs"
            value={AppTab.Logs}
          />
          <Tab
            classes={styles}
            icon={<SettingsIcon />}
            label="Settings"
            value={AppTab.Settings}
          />
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
