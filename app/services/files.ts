import unzip from 'unzipper';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { remote } from 'electron';
import cpy from 'cpy';

import { modsText } from '../static-text';

fetch.bind(window);

// Defines which portion of the loading bar is for download progress,
// and the remaining is for unzipping progress.
const progressDownloadPortion = 0.5;
const progressUnzipPortion = 0.25;
const progressCopyPortion = 0.25;

export async function downloadFile(
  url: string,
  filePath: string,
  onProgress: ProgressHandler
) {
  let receivedBytes = 0;

  const response = await fetch(url);

  return new Promise((resolve, reject) => {
    if (!response.ok) {
      reject(new Error(`${response.statusText} (${response.status})`));
      return;
    }

    const totalBytes = parseInt(
      response.headers.get('content-length') || '0',
      10
    );

    if (!response || !response.body) {
      reject(new Error('Response body not available'));
      return;
    }

    const writer = fs.createWriteStream(filePath);
    response.body.pipe(writer);

    response.body.on('data', (data) => {
      receivedBytes += data.length;
      onProgress(receivedBytes / totalBytes);
    });

    writer.on('finish', resolve);
  });
}

export async function unzipFile(
  zipPath: string,
  unzipPath: string,
  onProgress: ProgressHandler
) {
  const absUnzipPath = path.resolve(unzipPath);
  const extract = unzip.Extract({ path: absUnzipPath });
  const reader = fs.createReadStream(zipPath);

  const totalBytes = fs.statSync(zipPath).size;
  let extractedBytes = 0;

  reader.pipe(extract);

  reader.on('data', (data) => {
    extractedBytes += data.length;
    onProgress(extractedBytes / totalBytes);
  });

  return new Promise((resolve) => {
    extract.on('close', resolve);
  });
}

export async function createFolders(dir: string) {
  await fs.mkdirs(dir);
}

export async function copyFolder(
  sourcePath: string,
  targetPath: string,
  onProgress?: ProgressHandler
) {
  const sourceContents = fs.readdirSync(sourcePath);
  const innerPath =
    sourceContents.length === 1 &&
    fs.lstatSync(`${sourcePath}/${sourceContents[0]}`).isDirectory()
      ? `${sourcePath}/${sourceContents[0]}`
      : sourcePath;
  await fs.copy(innerPath, targetPath, {
    errorOnExist: false,
    overwrite: true,
    recursive: true,
  });
  const copy = cpy(innerPath, targetPath, { overwrite: true, parents: true });
  if (onProgress) {
    copy.on('progress', (progress) => onProgress(progress.percent));
  }
  return copy;
}

export function deleteFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.removeSync(folderPath);
  } else {
    throw new Error(`${modsText.deleteNonExistingError}: "${folderPath}"`);
  }
}

function getAppPath() {
  return path.dirname(remote.app.getAppPath());
}

export async function unzipRemoteFile(
  url: string,
  destinationPath: string,
  onProgress: ProgressHandler
) {
  const onDownloadProgress: ProgressHandler = (progress) => {
    console.log('onDownloadProgress', progress);
    onProgress(progress * progressDownloadPortion);
  };

  const onUnzipProgress: ProgressHandler = (progress) => {
    console.log('onUnzipProgress', progress);
    onProgress(progressDownloadPortion + progress * progressUnzipPortion);
  };

  const onCopyProgress: ProgressHandler = (progress) => {
    console.log('onCopyProgress', progress);
    onProgress(
      progressDownloadPortion +
        progressUnzipPortion +
        progress * progressCopyPortion
    );
  };

  const temporaryName = path.basename(destinationPath);
  const temporaryPath = `${getAppPath()}/temp/${temporaryName}-${new Date().getTime()}`;
  const zipPath = `${temporaryPath}/${temporaryName}.zip`;
  const unzipPath = `${temporaryPath}/${temporaryName}`;

  await createFolders(unzipPath);

  await downloadFile(url, zipPath, onDownloadProgress);
  await unzipFile(zipPath, unzipPath, onUnzipProgress);
  await copyFolder(unzipPath, destinationPath, onCopyProgress);
  await deleteFolder(temporaryPath);
}
