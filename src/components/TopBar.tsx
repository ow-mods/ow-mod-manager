import React from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Container,
  makeStyles,
} from '@material-ui/core';
import runOwml from '../services/run-owml';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

export default function TopBar() {
  const classes = useStyles();
  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Container>
            <Button
              onClick={runOwml}
              size="large"
              variant="contained"
              color="primary"
            >
              Start Game
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
}
