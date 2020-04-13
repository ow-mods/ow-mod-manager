import unzip from 'unzipper';
import request from 'request';
import fs from 'fs-extra';
import path from 'path';

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

async function downloadFile(url: string, filePath: string) {
  const writer = fs.createWriteStream(filePath);

  request(url).pipe(writer);
  return new Promise((resolve) => {
    writer.on('finish', resolve);
  });
}

async function unzipFile(zipPath: string, unzipPath: string) {
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

async function deleteFolder(folderPath: string) {
  await fs.remove(folderPath);
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

export async function uninstall(mod: Mod) {
  if (!isInstalled(mod)) {
    throw new Error("Can't uninstall mod because it's not installed");
  }
  await deleteFolder(mod.modPath);
}
