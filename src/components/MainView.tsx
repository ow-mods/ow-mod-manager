import React, { useState, useCallback } from 'react';
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

import { globalText } from '../static-text';
import { useAppState } from '../hooks';
import ModsPage from './Mods';
import SettingsPage from './Settings';
import LogsPage from './Logs';
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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    flex: 1,
    overflow: 'hidden scroll',
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Tab = {
  name: string;
  component: typeof ModsPage;
  icon: typeof BuildIcon;
  color?: 'primary' | 'secondary';
};

const tabs: readonly Tab[] = [
  {
    name: globalText.tabs.mods,
    component: ModsPage,
    icon: BuildIcon,
  },
  {
    name: globalText.tabs.logs,
    component: LogsPage,
    icon: DvrIcon,
  },
  {
    name: globalText.tabs.settings,
    component: SettingsPage,
    icon: SettingsIcon,
  },
] as const;

const updateTab: Tab = {
  name: globalText.tabs.update,
  component: UpdatePage,
  icon: NewReleasesIcon,
  color: 'secondary',
};

const MainView = () => {
  const tabStyles = useTabStyles();
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { appRelease } = useAppState();

  const isAppOutdated =
    appRelease && appRelease?.version !== remote.app.getVersion();
  const visibleTabs = isAppOutdated ? [...tabs, updateTab] : tabs;

  const handleStartGameClick = useCallback(() => {
    setSelectedTab(1);
  }, []);

  return (
    <CssBaseline>
      <div className={styles.wrapper}>
        <TopBar onStartGameClick={handleStartGameClick}>
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
        <Container className={styles.container}>
          {visibleTabs.map(
            (tab) =>
              visibleTabs[selectedTab].name === tab.name && (
                <tab.component key={tab.name} />
              ),
          )}
        </Container>
      </div>
      <Notifications />
    </CssBaseline>
  );
};

export default MainView;
