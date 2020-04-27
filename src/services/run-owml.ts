import { spawn } from 'child_process';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';

export function runOwml() {
  spawn(EXE_FILE, ['-owmmPort 3030'], {
    shell: true,
    cwd: config.owmlPath,
  });
}
