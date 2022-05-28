import React from 'react';
import { Toolbar, Container, makeStyles } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import { settingsState } from '../../store';

import StartGameButton from './StartGameButton';
import StartAlphaButton from './StartAlphaButton';
import AppTabs from './AppTabs';
import LoadingSuspense from '../LoadingSuspense';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    padding: 0,
    backgroundColor: theme.palette.grey[900],
  },
  wrapper: {
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      background: theme.palette.grey[900],
      borderRadius: 0,
    },
  },
}));

const TopBar: React.FunctionComponent = () => {
  const styles = useStyles();
  const inAlphaMode = useRecoilValue(settingsState).alphaMode;
  const button = inAlphaMode ? <StartAlphaButton /> : <StartGameButton />;

  return (
    <div className={styles.wrapper}>
      <Toolbar className={styles.toolbar}>
        <Container maxWidth="md" className={styles.container}>
          <AppTabs />
          <LoadingSuspense>{button}</LoadingSuspense>
        </Container>
      </Toolbar>
    </div>
  );
};

export default TopBar;
