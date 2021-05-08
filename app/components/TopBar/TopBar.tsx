import React from 'react';
import { Toolbar, Container, makeStyles } from '@material-ui/core';

import StartGameButton from './StartGameButton';
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

  return (
    <div className={styles.wrapper}>
      <Toolbar className={styles.toolbar}>
        <Container maxWidth="md" className={styles.container}>
          <AppTabs />
          <LoadingSuspense>
            <StartGameButton />
          </LoadingSuspense>
        </Container>
      </Toolbar>
    </div>
  );
};

export default TopBar;
