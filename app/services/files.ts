import unzip from 'unzipper';
// import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { remote } from 'electron';
import { exec } from 'child_process';

import { Readable } from 'stream';
import { modsText } from '../helpers/static-text';
import { debugConsole } from '../helpers/console-log';

// fetch.bind(window);

// Defines which portion of the loading bar is for download progress,
// and the remaining is for unzipping progress.
const progressDownloadPortion = 0.7;
const progressUnzipPortion = 0.3;

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
    const reader = response.body.getReader();
    const readable = new Readable();
    // eslint-disable-next-line no-underscore-dangle
    readable._read = async () => {
      const result = await reader.read();
      if (!result.done) {
        readable.push(Buffer.from(result.value));
      } else {
        readable.push(null);
      }
    };
    readable.pipe(writer);

    readable.on('data', (data) => {
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

export async function copyFolder(sourcePath: string, targetPath: string) {
  debugConsole.log('copy folder from', sourcePath, 'to', targetPath);
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
}

export function deleteFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.emptyDirSync(folderPath);
    fs.removeSync(folderPath);
  } else {
    throw new Error(`${modsText.deleteNonExistingError}: "${folderPath}"`);
  }
}

export function deleteFolderExcept(folderPath: string, pathsToKeep: string[]) {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`${modsText.deleteNonExistingError}: "${folderPath}"`);
  }

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const fileDir = path.join(folderPath, file);

    if (!pathsToKeep.includes(file)) {
      fs.removeSync(fileDir);
    }
  });
}

export async function unzipRemoteFile(
  url: string,
  destinationPath: string,
  onProgress: ProgressHandler
) {
  debugConsole.log('unzip remote file from', url, 'to', destinationPath);

  const onDownloadProgress: ProgressHandler = (progress) => {
    debugConsole.log('onDownloadProgress', progress);
    onProgress(progress * progressDownloadPortion);
  };

  const onUnzipProgress: ProgressHandler = (progress) => {
    debugConsole.log('onUnzipProgress', progress);
    onProgress(progressDownloadPortion + progress * progressUnzipPortion);
  };

  const temporaryName = path.basename(destinationPath);
  const userDataPath = remote.app.getPath('userData');
  const temporaryPath = `${userDataPath}/temp/${temporaryName}-${new Date().getTime()}`;
  const zipPath = `${temporaryPath}/${temporaryName}.zip`;
  const unzipPath = `${temporaryPath}/${temporaryName}`;

  await createFolders(unzipPath);

  await downloadFile(url, zipPath, onDownloadProgress);
  await unzipFile(zipPath, unzipPath, onUnzipProgress);
  await copyFolder(unzipPath, destinationPath);
  await deleteFolder(temporaryPath);
}

export function openDirectory(directoryPath: string) {
  if (!directoryPath) {
    throw new Error(modsText.modPathNotDefinedError);
  }
  if (!fs.existsSync(directoryPath)) {
    throw new Error(modsText.openNonExistingDirectoryError);
  }

  exec(`start "open directory" "${path.resolve(directoryPath)}"`);
}
