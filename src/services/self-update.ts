import { spawn } from 'child_process';
import { remote } from 'electron';

import { downloadFile, unzipFile } from '../services';

const BAT_FILE = 'update\\install-update.bat';
const updateUrl =
  'https://github.com/Raicuparta/ow-mod-manager/releases/download/0.0.3/OWModManager.zip';
const zipPath = 'OWModManager.zip';
const unzipPath = 'temp/OWModManager';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
  repo: string;
};

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

export async function downloadSelfUpdate() {
  await downloadFile(updateUrl, zipPath);
  await unzipFile(zipPath, unzipPath);
}
