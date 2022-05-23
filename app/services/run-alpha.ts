import { spawn } from 'child_process';
import { remote } from 'electron';

const EXE_FILE = 'CMOWA.exe';

let quitTimeout: NodeJS.Timeout;

function waitAndQuit() {
  if (quitTimeout) {
    return;
  }
  quitTimeout = setTimeout(remote.app.quit, 1000);
}

export async function runAlpha({
  closeOnPlay,
  alphaPath,
  cmowaPath,
}: Settings) {
  const cmowaParams = [];
  if (alphaPath) {
    cmowaParams.push(`-gamePath ${alphaPath}`);
  }

  spawn(EXE_FILE, cmowaParams, {
    shell: true,
    cwd: cmowaPath,
    detached: true,
  });

  if (closeOnPlay) {
    waitAndQuit();
  }
}
