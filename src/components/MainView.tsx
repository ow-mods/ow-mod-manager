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
  Error as NotificationIcon,
} from '@material-ui/icons';

import Mods from './Mods';
import SettingsPage from './Settings';
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

type Tab = {
  name: string;
  component: typeof Mods;
  icon: typeof BuildIcon;
  color?: 'primary' | 'secondary';
};

const tabs: readonly Tab[] = [
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
    component: SettingsPage,
    icon: SettingsIcon,
  },
  {
    name: 'Update',
    component: SettingsPage,
    icon: NotificationIcon,
    color: 'primary',
  },
] as const;

const MainView = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={selectedTab}>
          {tabs.map((tab: Tab, index: number) => (
            <Tab
              key={tab.name}
              label={tab.name}
              value={tab.name}
              classes={styles}
              icon={<tab.icon color={tab.color} />}
              onClick={() => setSelectedTab(index)}
            />
          ))}
        </Tabs>
      </TopBar>
      <LoadingBar />
      <Container>
        {tabs.map(
          (tab) =>
            tabs[selectedTab].name === tab.name && (
              <tab.component key={tab.name} />
            ),
        )}
      </Container>
    </CssBaseline>
  );
};

export default MainView;
