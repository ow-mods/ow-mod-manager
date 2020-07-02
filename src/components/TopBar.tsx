import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { PlayArrow as PlayIcon } from '@material-ui/icons';

import { runOwml } from '../services';
import { useAppState, useOwmlLogs, useSettings } from '../hooks';

const useStyles = makeStyles((theme) => ({
  offset: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    padding: 0,
  },
}));

const TopBar: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  const { modMap } = useAppState();
  const { serverPort, isServerRunning } = useOwmlLogs();
  const { settings, setSettings } = useSettings();

  function setDisableParameterWarnings() {
    setSettings({ disableParameterWarning: true });
  }

  async function handleStartGameClick() {
    runOwml(settings, serverPort, setDisableParameterWarnings);
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
    }
    if (isServerRunning) {
      return 'Already running';
    }
    return '';
  }

  return (
    <>
      <AppBar color="default">
        <Toolbar className={classes.toolbar}>
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
                  startIcon={<PlayIcon />}
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
