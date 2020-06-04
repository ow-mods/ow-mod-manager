import React, { useState } from 'react';
import { remote } from 'electron';
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
  NewReleases as NewReleasesIcon,
} from '@material-ui/icons';

import { useAppState } from '../hooks';
import Mods from './Mods';
import SettingsPage from './Settings';
import Logs from './Logs';
import TopBar from './TopBar';
import LoadingBar from './LoadingBar';
import UpdatePage from './Update';
import Notifications from './Notifications';

const useTabStyles = makeStyles({
  root: {
    minHeight: 0,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
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
] as const;

const updateTab: Tab = {
  name: 'Update',
  component: UpdatePage,
  icon: NewReleasesIcon,
  color: 'secondary',
};

const MainView = () => {
  const tabStyles = useTabStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { appRelease } = useAppState();

  const isAppOutdated =
    appRelease && appRelease.version !== remote.app.getVersion();
  const visibleTabs = isAppOutdated ? [...tabs, updateTab] : tabs;

  return (
    <CssBaseline>
      <TopBar>
        <Tabs value={selectedTab}>
          {visibleTabs.map((tab: Tab, index: number) => (
            <Tab
              key={tab.name}
              label={tab.name}
              value={index}
              classes={tabStyles}
              icon={<tab.icon color={tab.color} />}
              onClick={() => setSelectedTab(index)}
            />
          ))}
        </Tabs>
      </TopBar>
      <LoadingBar />
      <Container>
        {visibleTabs.map(
          (tab) =>
            visibleTabs[selectedTab].name === tab.name && (
              <tab.component key={tab.name} />
            ),
        )}
      </Container>
      <Notifications />
    </CssBaseline>
  );
};

export default MainView;
