import unzip from 'unzipper';
import request from 'request';
import fs from 'fs-extra';
import path from 'path';

// Defines which portion of the loading bar is for download progress,
// and the remaining is for unzipping progress.
const progressDownloadPortion = 0.8;
const progressUnzipPortion = 1 - progressDownloadPortion;

export async function downloadFile(
  url: string,
  filePath: string,
  onProgress: ProgressHandler,
) {
  const writer = fs.createWriteStream(filePath);

  let receivedBytes = 0;
  let totalBytes = 0;

  const fileRequest = request(url);

  fileRequest.on('response', (response) => {
    totalBytes = parseInt(response.headers['content-length'] || '0');
  });

  fileRequest.on('data', (data) => {
    receivedBytes += data.length;
    onProgress(receivedBytes / totalBytes);
  });

  fileRequest.pipe(writer);

  return new Promise((resolve) => {
    writer.on('finish', resolve);
  });
}

export async function unzipFile(
  zipPath: string,
  unzipPath: string,
  onProgress: ProgressHandler,
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
  fs.removeSync(folderPath);
}

export async function unzipRemoteFile(
  url: string,
  destinationPath: string,
  onProgress: ProgressHandler,
) {
  const onDownloadProgress: ProgressHandler = (progress) => {
    onProgress(progress * progressDownloadPortion);
  };

  const onUnzipProgress: ProgressHandler = (progress) => {
    onProgress(progressDownloadPortion + progress * progressUnzipPortion);
  };

  const temporaryName = path.basename(destinationPath);
  const temporaryPath = `temp/${temporaryName}-${new Date().getTime()}`;
  const zipPath = `${temporaryPath}/${temporaryName}.zip`;
  const unzipPath = `${temporaryPath}/${temporaryName}`;

  await createFolders(unzipPath);
  await downloadFile(url, zipPath, onDownloadProgress);
  await unzipFile(zipPath, unzipPath, onUnzipProgress);
  await copyFolder(unzipPath, destinationPath);
  await deleteFolder(temporaryPath);
}
