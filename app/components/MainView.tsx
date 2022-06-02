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
import { ErrorBoundary } from './ErrorBoundary';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    overflow: 'hidden',
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
              <ErrorBoundary>
                <LoadingSuspense key={tab.name}>
                  <tab.component />
                </LoadingSuspense>
              </ErrorBoundary>
            )
        )}
      </div>
    </CssBaseline>
  );
};

export default MainView;
