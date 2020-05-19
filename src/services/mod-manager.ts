import path from 'path';
import { shell } from 'electron';

import {
  downloadFile,
  unzipFile,
  copyFolder,
  deleteFolder,
  createFolders,
  getConfig,
  saveConfig,
} from '.';

// Defines which portion of the loading bar is for download progress,
// and the remaining is for unzipping progress.
const progressDownloadPortion = 0.8;
const progressUnzipPortion = 1 - progressDownloadPortion;

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

  // TODO actually check if remote version is superior instead of just different.
  return mod.remoteVersion !== mod.localVersion;
}

async function upstall(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.downloadUrl) {
    return;
  }

  const temporaryPath = `temp/${mod.name}-${new Date().getTime()}`;
  const zipPath = `${temporaryPath}/${mod.name}.zip`;
  const unzipPath = `${temporaryPath}/${mod.name}`;

  const onDownloadProgress: ProgressHandler = (progress) => {
    onProgress(progress * progressDownloadPortion);
  };

  const onUnzipProgress: ProgressHandler = (progress) => {
    onProgress(progressDownloadPortion + progress * progressUnzipPortion);
  };

  await createFolders(unzipPath);
  await downloadFile(mod.downloadUrl, zipPath, onDownloadProgress);
  await unzipFile(zipPath, unzipPath, onUnzipProgress);
  await copyFolder(unzipPath, mod.modPath);
  await deleteFolder(temporaryPath);
}

export async function install(mod: Mod, onProgress: ProgressHandler) {
  if (isInstalled(mod)) {
    throw new Error("Can't install mod because it's already installed");
  }
  await upstall(mod, onProgress);
}

export async function update(mod: Mod, onProgress: ProgressHandler) {
  if (!isOutdated) {
    throw new Error("Can't update mod because it's not out of date");
  }
  await upstall(mod, onProgress);
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

export function isEnabled(mod: Mod): boolean {
  const config = getConfig(mod);
  return config.enabled;
}

export function toggleEnabled(mod: Mod) {
  const config = getConfig(mod);
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
