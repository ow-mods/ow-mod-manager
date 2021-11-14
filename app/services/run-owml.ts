import { spawn } from 'child_process';
import { remote } from 'electron';

const EXE_FILE = 'OWML.Launcher.exe';

let quitTimeout: NodeJS.Timeout;

function waitAndQuit() {
  if (quitTimeout) {
    return;
  }
  quitTimeout = setTimeout(remote.app.quit, 1000);
}

export async function runOwml(
  { closeOnPlay, logToSocket, owmlPath }: Settings,
  port: number
) {
  const owmlParams = [];
  if (!closeOnPlay && logToSocket) {
    owmlParams.push(`-consolePort ${port}`);
  }

  spawn(EXE_FILE, owmlParams, {
    shell: true,
    cwd: owmlPath,
    detached: true,
  });

  if (closeOnPlay) {
    waitAndQuit();
  }
}
