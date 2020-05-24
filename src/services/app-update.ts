import axios from 'axios';
import { remote } from 'electron';
import { spawn } from 'child_process';

import { unzipRemoteFile } from './files';

const BAT_FILE = '"install-update.bat"';
const updateUrl =
  'https://github.com/Raicuparta/ow-mod-manager/releases/download/0.0.3/OWModManager.zip';
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

export async function downloadAppUpdate(onProgress: ProgressHandler) {
  await unzipRemoteFile(updateUrl, unzipPath, onProgress);
}

export async function getIsAppOutdated(repo: string) {
  const packageJsonUrl = `https://raw.githubusercontent.com/${repo}/master/package.json`;
  return axios.get(packageJsonUrl).then(({ data }) => {
    const remoteVersion: string = data.version;
    const localVersion = remote.app.getVersion();
    return remoteVersion !== localVersion;
  });
}
