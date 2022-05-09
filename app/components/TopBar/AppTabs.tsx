import React from 'react';
import { useRecoilState } from 'recoil';
import { Tabs, Tab, makeStyles } from '@material-ui/core';
import {
  Build as BuildIcon,
  Dvr as DvrIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

import { globalText } from '../../helpers/static-text';
import { selectedTabState } from '../../store';
import ModsPage from '../Mods';
import SettingsPage from '../Settings';
import LogsPage from '../Logs';

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
  component: typeof ModsPage;
  icon: typeof BuildIcon;
  color?: 'primary' | 'secondary';
};

export const tabList: readonly Tab[] = [
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

const AppTabs = () => {
  const tabStyles = useTabStyles();
  const [selectedTab, setSelectedTab] = useRecoilState(selectedTabState);

  return (
    <Tabs value={selectedTab} variant={"scrollable"} scrollButtons={"on"}>
      {tabList.map((tab: Tab, index: number) => (
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
  );
};

export default AppTabs;
