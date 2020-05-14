import { spawn } from 'child_process';
import { remote } from 'electron';

const BAT_FILE = 'install-update.bat';

export function runSelfUpdate() {
  const ls = spawn('cmd.exe', ['/c', BAT_FILE], {
    detached: true,
    shell: true,
  });

  remote.app.quit();

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });
}
