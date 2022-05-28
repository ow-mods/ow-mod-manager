import { spawn } from 'child_process';
import { remote } from 'electron';

const EXE_FILE = 'OWAML.exe';

let quitTimeout: NodeJS.Timeout;

function waitAndQuit() {
  if (quitTimeout) {
    return;
  }
  quitTimeout = setTimeout(remote.app.quit, 1000);
}

export async function runAlpha(
  { closeOnPlay, logToSocket, alphaPath, owamlPath }: Settings,
  port: number
) {
  const owamlParams = [];
  if (!closeOnPlay && logToSocket) {
    owamlParams.push(`-consolePort ${port}`);
  }
  if (alphaPath) {
    owamlParams.push(`-gamePath "${alphaPath}"`);
  }

  spawn(EXE_FILE, owamlParams, {
    shell: true,
    cwd: owamlPath,
    detached: true,
  });

  if (closeOnPlay) {
    waitAndQuit();
  }
}
