import { spawn } from 'child_process';
import { remote } from 'electron';

import { settingsText } from '../static-text';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';

let quitTimeout: NodeJS.Timeout;

function waitAndQuit() {
  if (quitTimeout) {
    return;
  }
  quitTimeout = setTimeout(remote.app.quit, 1000);
}

export async function runOwml(
  {
    closeOnPlay,
    logToSocket,
    openVRParameter,
    disableParameterWarning,
  }: Settings,
  port: number,
  disableParameterWarningCallback: () => void,
) {
  const params = [];
  const paramNames = [];
  if (!closeOnPlay && logToSocket) {
    params.push(`-consolePort ${port}`);
    paramNames.push(settingsText.logToSocket.label);
  }
  if (openVRParameter) {
    params.push(`-vrmode openvr`);
    paramNames.push(settingsText.openVRParameter.label);
  }

  if (!disableParameterWarning && params.length > 0) {
    const { response, checkboxChecked } = await remote.dialog.showMessageBox({
      type: 'warning',
      title: remote.app.name,
      message: settingsText.steamParamsWarning.message,
      detail: settingsText.steamParamsWarning.detail(paramNames),
      checkboxLabel: settingsText.steamParamsWarning.dontShowAgain,
      buttons: ['OK', 'Cancel'],
    });

    if (response === 1) {
      return;
    }

    if (checkboxChecked) {
      disableParameterWarningCallback();
    }
  }

  spawn(EXE_FILE, params, {
    shell: true,
    cwd: config.owmlPath,
    detached: true,
  });

  if (closeOnPlay) {
    waitAndQuit();
  }
}
