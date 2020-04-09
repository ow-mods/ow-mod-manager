import exec from 'child_process';

// TODO: find correct OWML directory.
const OWML_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML';
const EXE_FILE = 'OWML.Launcher.exe';

function runOwml() {
    exec.execFile(EXE_FILE, {
        shell: true,
        cwd: OWML_DIR
    }, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
    });
}

export default runOwml;
