import path from 'path';
import { shell } from 'electron';

import { deleteFolder, getConfig, saveConfig } from '.';
import { unzipRemoteFile } from './files';

export function isInstalled(mod: Mod): boolean {
  return Boolean(mod.localVersion);
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

  await unzipRemoteFile(mod.downloadUrl, mod.modPath, onProgress);
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
  shell.openPath(path.resolve(mod.modPath));
}

export function openRepo(mod: Mod) {
  if (!mod.repo) {
    throw new Error(
      "Can't open repository because there's no registered repository URL",
    );
  }
  shell.openExternal(mod.repo);
}

export async function isEnabled(mod: Mod) {
  const config = await getConfig(mod);
  return config.enabled;
}

export async function toggleEnabled(mod: Mod) {
  const config = await getConfig(mod);
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
