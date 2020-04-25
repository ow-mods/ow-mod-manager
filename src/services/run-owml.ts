import { spawn } from 'child_process';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';

function runOwml() {
  spawn(EXE_FILE, ['-owmmPort 3030'], {
    shell: true,
    cwd: config.owmlPath,
  });
}

export default runOwml;
