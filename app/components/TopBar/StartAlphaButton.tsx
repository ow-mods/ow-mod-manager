import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { PlayArrow as PlayIcon } from '@material-ui/icons';

import { useRecoilValue } from 'recoil';
import { remote } from 'electron';
import { globalText } from '../../helpers/static-text';
import { runAlpha, writeSettings } from '../../services';
import {
  settingsState,
  requiredModNamesState,
  enabledModList,
} from '../../store';

const StartAlphaButton: React.FunctionComponent = () => {
  const requiredModNames = useRecoilValue(requiredModNamesState);
  const settings = useRecoilValue(settingsState);
  const enabledMods = useRecoilValue(enabledModList);

  async function handleStartGameClick() {
    let newSettings = { ...settings };

    for (let i = 0; i < enabledMods.length; i += 1) {
      const { warning, name, uniqueName } = enabledMods[i];

      if (
        warning &&
        (warning.body || warning.title) &&
        !settings.disableModWarnings[uniqueName]
      ) {
        const {
          response,
          checkboxChecked,
          // eslint-disable-next-line no-await-in-loop
        } = await remote.dialog.showMessageBox({
          type: 'warning',
          title: name,
          message: warning.title ?? '',
          detail: warning.body,
          checkboxLabel: globalText.dialog.dontShowAgain,
          buttons: [globalText.dialog.ok, globalText.dialog.cancel],
        });

        if (response === 1) {
          return;
        }

        newSettings = {
          ...newSettings,
          disableModWarnings: {
            ...newSettings.disableModWarnings,
            [uniqueName]: checkboxChecked,
          },
        };
      }
    }

    writeSettings(newSettings);

    runAlpha(settings);
  }

  const isMissingAlphaPath =
    settings.alphaPath === null || settings.alphaPath.match(/^ *$/) !== null;
  const isMissingOawmlPath =
    settings.owamlPath === null || settings.owamlPath.match(/^ *$/) !== null;
  const isMissingRequiredMod = requiredModNames.length > 0;
  const isStartDisabled =
    isMissingRequiredMod || isMissingAlphaPath || isMissingOawmlPath;

  function getStartGameTooltip() {
    if (isMissingAlphaPath) {
      return globalText.alphaPathMissing;
    }
    if (isMissingOawmlPath) {
      return globalText.owamlPathMissing;
    }
    if (isMissingRequiredMod) {
      return globalText.missingRequiredMod(requiredModNames);
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
          color="secondary"
          disabled={isStartDisabled}
          startIcon={<PlayIcon />}
        >
          {globalText.startAlpha}
        </Button>
      </span>
    </Tooltip>
  );
};

export default StartAlphaButton;
