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

export function runOwml(closeManager: boolean, port?: number, openVR = false) {
  const params = [];
  if (!closeManager && port !== undefined) {
    params.push(`-consolePort ${port}`);
  }
  if (openVR) {
    params.push(`-vrmode openvr`);
  }

  // spawn(EXE_FILE, params, {
  //   shell: true,
  //   cwd: config.owmlPath,
  //   detached: true,
  // });

  if (closeManager) {
    waitAndQuit();
  }
}
