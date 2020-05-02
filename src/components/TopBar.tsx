import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  makeStyles,
  Tooltip,
} from '@material-ui/core';

import { runOwml } from '../services';
import { useAppState, useOwmlLogs } from '../hooks';

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
  const { startServer, isServerRunning } = useOwmlLogs();

  async function handleStartGameClick() {
    const port = await startServer();
    runOwml(port);
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
      return 'Already running';
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
