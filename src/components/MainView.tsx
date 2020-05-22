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

const useStyles = makeStyles({
  root: {
    minHeight: 0,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

const tabs = [
  {
    name: 'Mods',
    component: Mods,
    icon: BuildIcon,
  },
  {
    name: 'Logs',
    component: Logs,
    icon: DvrIcon,
  },
  {
    name: 'Settings',
    component: Settings,
    icon: SettingsIcon,
  },
] as const;

type Tab = typeof tabs[number]['name'];

const MainView = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<Tab>('Mods');

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={selectedTab}>
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              label={tab.name}
              value={tab.name}
              classes={styles}
              icon={<tab.icon />}
              onClick={() => setSelectedTab(tab.name)}
            />
          ))}
        </Tabs>
      </TopBar>
      <LoadingBar />
      <Container>
        {tabs.map((tab) => selectedTab === tab.name && <tab.component />)}
      </Container>
    </CssBaseline>
  );
};

export default MainView;
