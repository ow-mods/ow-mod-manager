import { spawn } from 'child_process';
import { remote } from 'electron';

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
  // TODO improve this. If static text were saved in a central location, would be cleaner.
  const paramNames = [];
  if (!closeOnPlay && logToSocket) {
    params.push(`-consolePort ${port}`);
    paramNames.push('Send game logs to Mod Manager');
  }
  if (openVRParameter) {
    params.push(`-vrmode openvr`);
    paramNames.push('Force OpenVR mode');
  }

  if (!disableParameterWarning && params.length > 0) {
    const warningDetail = `You enabled "${paramNames.join('" and "')}".

If you own the Steam version of the game, Steam might show a warning about custom parameters.

The warning might not be visible until you open a Steam window.

If you have SteamVR running, the warning might only be visible while you're using your VR headset.

If you want Steam to stop bothering you about this, you'll have to disable these options in the Mod Manager settings.`;

    const { response, checkboxChecked } = await remote.dialog.showMessageBox({
      type: 'warning',
      title: 'Outer Wilds Mod Manager',
      message: 'Steam might show a warning before starting the game',
      detail: warningDetail,
      checkboxLabel: "Don't show this again",
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
