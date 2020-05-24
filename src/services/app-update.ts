import { remote } from 'electron';
import { spawn } from 'child_process';

import { unzipRemoteFile } from './files';

const BAT_FILE = '"install-update.bat"';
const unzipPath = 'update';

export function installAppUpdate() {
  const ls = spawn('cmd.exe', ['/c', BAT_FILE], {
    detached: true,
    shell: true,
    cwd: unzipPath,
  });

  remote.app.exit();

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });
}

export async function downloadAppUpdate(
  url: string,
  onProgress: ProgressHandler,
) {
  await unzipRemoteFile(url, unzipPath, onProgress);
}
