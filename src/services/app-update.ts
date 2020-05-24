import { remote } from 'electron';
import { spawn } from 'child_process';

import { unzipRemoteFile } from './files';

const BAT_FILE = '"install-update.bat"';
const updatePath = 'update/resources';

export function installAppUpdate() {
  spawn('cmd.exe', ['/c', BAT_FILE], {
    detached: true,
    shell: true,
    cwd: updatePath,
  });

  remote.app.exit();
}

export async function downloadAppUpdate(
  url: string,
  onProgress: ProgressHandler,
) {
  await unzipRemoteFile(url, updatePath, onProgress);
}
