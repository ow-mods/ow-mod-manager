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

export function isEnabled(mod: Mod): boolean {
  const config = getConfig(mod);
  return config.enabled;
}

export function toggleEnabled(mod: Mod) {
  const config = getConfig(mod);
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
