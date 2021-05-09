import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { PlayArrow as PlayIcon } from '@material-ui/icons';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { remote } from 'electron';
import { globalText, modsText } from '../../static-text';
import { runOwml, writeSettings } from '../../services';
import {
  requiredModNamesState,
  isLogServerRunningState,
  logServerPortState,
  settingsState,
  selectedTabState,
  isVrModEnabledState,
  enabledModList,
} from '../../store';

const StartGameButton: React.FunctionComponent = () => {
  const requiredModNames = useRecoilValue(requiredModNamesState);
  const isLogServerRunning = useRecoilValue(isLogServerRunningState);
  const logServerPort = useRecoilValue(logServerPortState);
  const settings = useRecoilValue(settingsState);
  const setSelectedTab = useSetRecoilState(selectedTabState);
  const isVrModEnabled = useRecoilValue(isVrModEnabledState);
  const enabledMods = useRecoilValue(enabledModList);

  function setDisableParameterWarnings() {
    writeSettings({ ...settings, disableParameterWarning: true });
  }

  async function showVrWarning(modName: string, warning: Warning) {
    const { response, checkboxChecked } = await remote.dialog.showMessageBox({
      type: 'warning',
      title: modName,
      message: warning.title ?? '',
      detail: warning.body,
      checkboxLabel: modsText.warningDontShowAgain,
      buttons: ['OK', 'Cancel'],
    });

    if (response === 1) {
      return false;
    }

    // if (checkboxChecked) {
    //   writeSettings({ ...settings, disableVrWarning: true });
    // }

    return true;
  }

  async function handleStartGameClick() {
    // const modsWithWarnings = enabledMods.filter(
    //   ({ warning }) => warning && (warning.body || warning.title)
    // );

    for (let i = 0; i < enabledMods.length; i += 1) {
      const { warning, name } = enabledMods[i];
      if (warning && (warning.body || warning.title)) {
        // eslint-disable-next-line no-await-in-loop
        const shouldStartGame = await showVrWarning(name, warning);
        if (!shouldStartGame) {
          return;
        }
      }
    }

    // enabledMods.forEach(async ({ warning }) => {
    //   if (warning && (warning.body || warning.title)) {
    //     const shouldStartGame = await showVrWarning(warning);
    //   }
    // });

    // const shouldStartGame = await showVrWarning();
    // if (!shouldStartGame) {
    //   return;
    // }
    runOwml(settings, logServerPort, setDisableParameterWarnings);
    if (settings.logToSocket) {
      setSelectedTab(1);
    }
  }

  const isMissingRequiredMod = requiredModNames.length > 0;
  const isStartDisabled = isMissingRequiredMod || isLogServerRunning;

  function getStartGameTooltip() {
    if (isMissingRequiredMod) {
      return globalText.missingRequiredMod(requiredModNames);
    }
    if (isLogServerRunning) {
      return globalText.gameRunning;
    }
    return '';
  }

  return (
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
  );
};

export default StartGameButton;
