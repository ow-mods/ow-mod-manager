import exec from 'child_process';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';
const options = {
  shell: true,
  cwd: config.owmlPath,
};

function runOwml() {
  exec.execFile(EXE_FILE, options, (error) => {
    if (error) {
      throw error;
    }
  });
}

export default runOwml;
