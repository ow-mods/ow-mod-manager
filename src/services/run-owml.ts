import exec from 'child_process';
import { remote } from 'electron';

import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';
const options = {
  shell: true,
  cwd: config.owmlPath,
};
let quitTimeout: NodeJS.Timeout;

function waitAndQuit() {
  if (quitTimeout) {
    return;
  }
  quitTimeout = setTimeout(remote.app.quit, 1000);
}

function runOwml() {
  exec.execFile(EXE_FILE, options, (error) => {
    if (error) {
      if (quitTimeout) {
        // If there's an error launching the game,
        // don't close the mod manager.
        clearTimeout(quitTimeout);
      }
      throw error;
    }
  });
  waitAndQuit();
}

export default runOwml;
