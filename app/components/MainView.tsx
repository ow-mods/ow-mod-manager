import React from 'react';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import TopBar from './TopBar/TopBar';
import LoadingBar from './LoadingBar';
import { tabList } from './TopBar/AppTabs';
import { selectedTabState } from '../store';
import LoadingSuspense from './LoadingSuspense';
import { AppAlert } from './AppAlert';
import { useProtocol } from '../hooks';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
  },
});

const MainView = () => {
  const styles = useStyles();
  const selectedTab = useRecoilValue(selectedTabState);
  useProtocol();

  return (
    <CssBaseline>
      <div className={styles.wrapper}>
        <TopBar />
        <AppAlert />
        <LoadingBar />
        {tabList.map(
          (tab) =>
            tabList[selectedTab].name === tab.name && (
              <LoadingSuspense key={tab.name}>
                <tab.component />
              </LoadingSuspense>
            )
        )}
      </div>
    </CssBaseline>
  );
};

export default MainView;
