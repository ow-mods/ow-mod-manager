import unzip from 'unzipper';
import request from 'request';
import fs from 'fs-extra';
import path from 'path';
import { shell } from 'electron';

export function isInstalled(mod: Mod): boolean {
  return !!mod.localVersion;
}

export function isOutdated(mod: Mod): boolean {
  if (
    !isInstalled(mod) ||
    mod.remoteVersion === undefined ||
    mod.localVersion === undefined
  ) {
    return false;
  }

  if (mod.localVersion.startsWith('<')) {
    return true;
  }

  const remoteVersionNumbers = mod.remoteVersion.split('.');
  const localVersionNumbers = mod.localVersion.split('.');

  const length = Math.max(
    remoteVersionNumbers.length,
    localVersionNumbers.length,
  );

  for (let i = 0; i < length; i += 1) {
    const remoteVersionChunk = remoteVersionNumbers[i];
    const localVersionChunk = localVersionNumbers[i];

    if (remoteVersionChunk === undefined && localVersionChunk !== undefined) {
      return false;
    }

    if (remoteVersionChunk !== undefined && localVersionChunk === undefined) {
      return true;
    }

    if (remoteVersionNumbers[i] > localVersionNumbers[i]) {
      return true;
    }
  }

  return false;
}

async function createFolders(dir: string) {
  await fs.mkdirs(dir);
}

// TODO move this somewhere else
export async function downloadFile(url: string, filePath: string) {
  const writer = fs.createWriteStream(filePath);

  let receivedBytes = 0;
  let totalBytes = 0;

  const fileRequest = request(url);
  fileRequest.on('response', (response) => {
    totalBytes = parseInt(response.headers['content-length'] || '0');
  });
  fileRequest.on('data', (data) => {
    receivedBytes += data.length;
    console.log('download progress:', (receivedBytes / totalBytes) * 100, '%');
  });

  fileRequest.pipe(writer);

  return new Promise((resolve) => {
    writer.on('finish', resolve);
  });
}

export async function unzipFile(zipPath: string, unzipPath: string) {
  const absUnzipPath = path.resolve(unzipPath);
  const extract = unzip.Extract({ path: absUnzipPath });
  const reader = fs.createReadStream(zipPath);
  reader.pipe(extract);
  return new Promise((resolve) => {
    extract.on('close', resolve);
  });
}

async function copyFolder(sourcePath: string, targetPath: string) {
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

function deleteFolder(folderPath: string) {
  fs.removeSync(folderPath);
}

async function upstall(mod: Mod) {
  if (!mod.downloadUrl) {
    return;
  }

  const temporaryPath = `temp/${mod.name}-${new Date().getTime()}`;
  const zipPath = `${temporaryPath}/${mod.name}.zip`;
  const unzipPath = `${temporaryPath}/${mod.name}`;

  await createFolders(unzipPath);
  await downloadFile(mod.downloadUrl, zipPath);
  await unzipFile(zipPath, unzipPath);
  await copyFolder(unzipPath, mod.modPath);
  await deleteFolder(temporaryPath);
}

export async function install(mod: Mod) {
  if (isInstalled(mod)) {
    throw new Error("Can't install mod because it's already installed");
  }
  await upstall(mod);
}

export async function update(mod: Mod) {
  if (!isOutdated) {
    throw new Error("Can't update mod because it's not out of date");
  }
  await upstall(mod);
}

export function uninstall(mod: Mod) {
  if (!isInstalled(mod)) {
    throw new Error("Can't uninstall mod because it's not installed");
  }
  deleteFolder(mod.modPath);
}

export function openDirectory(mod: Mod) {
  if (!mod.modPath) {
    throw new Error("Can't open directory mod path is not defined");
  }
  shell.openItem(path.resolve(mod.modPath));
}

export function openRepo(mod: Mod) {
  if (!mod.repo) {
    throw new Error(
      "Can't open repository because there's no registered repository URL",
    );
  }
  shell.openExternal(mod.repo);
}
