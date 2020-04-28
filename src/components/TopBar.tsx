import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  makeStyles,
} from '@material-ui/core';

import { runOwml } from '../services';
import { useAppState, useOwmlLogs } from '../hooks';
import Tooltip from './Tooltip';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const TopBar: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  const { modMap } = useAppState();
  const { startServer, isLoggerInstalled, isServerRunning } = useOwmlLogs();

  async function handleStartGameClick() {
    if (isLoggerInstalled) {
      const port = await startServer();
      runOwml(port);
    } else {
      runOwml();
    }
  }

  const requiredMods = Object.values(modMap).filter((mod) => mod.isRequired);
  const isMissingRequiredMod = requiredMods.some(
    (mod) => mod.localVersion === undefined,
  );
  const requiredModNames = requiredMods.map((mod) => mod.name).join(', ');
  const isStartDisabled = isMissingRequiredMod || isServerRunning;

  function getStartGameTooltip() {
    if (isMissingRequiredMod) {
      return `Please install ${requiredModNames} before starting the game`;
    } else if (isServerRunning) {
      // TODO: This tooltip only makes sense if we patch OWML
      // to allow for running multiple instances of the game.
      return `
        Console already running.
        Open a new instance of the Mod Manager
        if you need multiple instances of the game running.
      `;
    } else {
      return '';
    }
  }

  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Container className={classes.container}>
            {children}
            <Tooltip title={getStartGameTooltip()}>
              <span>
                <Button
                  onClick={handleStartGameClick}
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={isStartDisabled}
                >
                  Start Game
                </Button>
              </span>
            </Tooltip>
          </Container>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
};

export default TopBar;
