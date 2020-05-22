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

export function runOwml(closeManager: boolean, port?: number) {
  const params = !closeManager && port ? [`-consolePort ${port}`] : undefined;

  spawn(EXE_FILE, params, {
    shell: true,
    cwd: config.owmlPath,
  });

  if (closeManager) {
    waitAndQuit();
  }
}
