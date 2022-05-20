import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { PlayArrow as PlayIcon } from '@material-ui/icons';

import { useRecoilValue } from 'recoil';
import { remote } from 'electron';
import { globalText } from '../../helpers/static-text';
import { runAlpha, writeSettings, hasWrongBepInExVersion } from '../../services';
import { settingsState, requiredAlphaModNamesState, enabledAlphaModList } from '../../store';

const StartAlphaButton: React.FunctionComponent = () => {
  const requiredModNames = useRecoilValue(requiredAlphaModNamesState);
  const settings = useRecoilValue(settingsState);
  const enabledMods = useRecoilValue(enabledAlphaModList);
  const bepInEx = enabledMods.find((mod : Mod) => mod.uniqueName == "bbepis.BepInEx");
  const wrongBepinExVersion = !enabledMods.every((mod: Mod) => !hasWrongBepInExVersion(mod, bepInEx));

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

  const isMissingAlphaPath = settings.alphaPath === null || settings.alphaPath.match(/^ *$/) !== null;
  const isMissingCmowaPath = settings.cmowaPath === null || settings.cmowaPath.match(/^ *$/) !== null;
  const isMissingRequiredMod = requiredModNames.length > 0;
  const isMissingBepInEx = !bepInEx;
  const isStartDisabled = isMissingRequiredMod || isMissingAlphaPath || isMissingCmowaPath || isMissingBepInEx || wrongBepinExVersion;

  function getStartGameTooltip() {
    if (isMissingAlphaPath){
      return 'You need to set the path to the game folder in settings.';
    }
    if (isMissingCmowaPath){
      return 'You need to set the path to the CMOWA folder in settings.';
    }
    if (isMissingRequiredMod) {
      return globalText.missingRequiredMod(requiredModNames);
    }
    if (isMissingBepInEx) {
      return globalText.missingRequiredMod(["bbepis.BepInEx"]);
    }
    if (wrongBepinExVersion) {
      return globalText.incompatibleBepInExVersion;
    }
    return 'Play Outer Wilds Alpha';
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
