import axios from 'axios';
import { remote } from 'electron';
import { spawn } from 'child_process';

import { downloadFile, unzipFile } from '.';

const BAT_FILE = '"install-update.bat"';
const updateUrl =
  'https://github.com/Raicuparta/ow-mod-manager/releases/download/0.0.3/OWModManager.zip';
const zipPath = 'OWModManager.zip';
const unzipPath = 'update';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
  repo: string;
};

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

export async function downloadAppUpdate() {
  // TODO handle progress
  await downloadFile(updateUrl, zipPath, () => {});
  await unzipFile(zipPath, unzipPath, () => {});
}

export async function getIsAppOutdated(repo: string) {
  const packageJsonUrl = `https://raw.githubusercontent.com/${repo}/master/package.json`;
  return axios.get(packageJsonUrl).then(({ data }) => {
    const remoteVersion: string = data.version;
    const localVersion = remote.app.getVersion();
    return remoteVersion !== localVersion;
  });
}
