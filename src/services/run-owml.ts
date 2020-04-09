import exec from 'child_process';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';

function runOwml() {
    exec.execFile(EXE_FILE, {
        shell: true,
        cwd: config.owmlPath
    }, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
    });
}

export default runOwml;
