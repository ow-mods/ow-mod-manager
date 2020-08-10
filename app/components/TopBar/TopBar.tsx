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
}));

const TopBar: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <Toolbar className={classes.toolbar}>
      <Container className={classes.container}>
        <AppTabs />
        <LoadingSuspense>
          <StartGameButton />
        </LoadingSuspense>
      </Container>
    </Toolbar>
  );
};

export default TopBar;
