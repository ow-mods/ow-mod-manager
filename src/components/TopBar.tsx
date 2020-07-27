import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  makeStyles,
  Tooltip,
  Paper,
} from '@material-ui/core';
import { PlayArrow as PlayIcon } from '@material-ui/icons';

import { globalText } from '../static-text';
import { runOwml } from '../services';
import { useAppState, useOwmlLogs, useSettings } from '../hooks';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    padding: 0,
    //marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.grey[900],
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
  const requiredModNames = requiredMods.map((mod) => mod.name);
  const isStartDisabled = isMissingRequiredMod || isServerRunning;

  function getStartGameTooltip() {
    if (isMissingRequiredMod) {
      return globalText.missingRequiredMod(requiredModNames);
    }
    if (isServerRunning) {
      return globalText.gameRunning;
    }
    return '';
  }

  return (
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
              {globalText.startGame}
            </Button>
          </span>
        </Tooltip>
      </Container>
    </Toolbar>
  );
};

export default TopBar;
