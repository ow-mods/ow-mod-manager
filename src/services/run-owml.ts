import { spawn } from 'child_process';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';

export function runOwml(port?: number) {
  const params = port ? [`-owmmPort ${port}`] : undefined;

  spawn(EXE_FILE, params, {
    shell: true,
    cwd: config.owmlPath,
  });
}
