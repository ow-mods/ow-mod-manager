import { shell } from 'electron';

import { modsText } from '../helpers/static-text';
import { getConfig, saveConfig } from './mod-config';
import { unzipRemoteFile, deleteFolder, openDirectory } from './files';

export function isInstalled(mod: Mod): boolean {
  if (!mod) {
    return false;
  }
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

  return mod.remoteVersion !== mod.localVersion;
}

async function upstall(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.downloadUrl) {
    return;
  }

  await unzipRemoteFile(mod.downloadUrl, mod.modPath, onProgress);
}

async function upstallPrerelease(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.prerelease) {
    return;
  }

  await unzipRemoteFile(mod.prerelease.downloadUrl, mod.modPath, onProgress);
}

export async function install(mod: Mod, onProgress: ProgressHandler) {
  if (isInstalled(mod)) {
    throw new Error(modsText.installAlreadyInstalledError);
  }
  await upstall(mod, onProgress);
}

export async function installPrerelease(mod: Mod, onProgress: ProgressHandler) {
  await upstallPrerelease(mod, onProgress);
}

export async function update(mod: Mod, onProgress: ProgressHandler) {
  if (!isOutdated) {
    throw new Error(modsText.updateNotOutOfDateError);
  }
  await upstall(mod, onProgress);
}

export function uninstall(mod: Mod) {
  if (!isInstalled(mod)) {
    throw new Error(modsText.uninstallNotInstalledError);
  }
  return deleteFolder(mod.modPath);
}

export function openModDirectory(mod: Mod) {
  openDirectory(mod.modPath);
}

export function openRepo(mod: Mod) {
  if (!mod.repo) {
    throw new Error(modsText.undefinedRepoUrlError);
  }
  shell.openExternal(mod.repo);
}

export function isEnabled(mod: Mod) {
  if (!isInstalled(mod)) {
    return false;
  }
  const config = getConfig(mod);
  return config?.enabled ?? false;
}

export function isBroken(mod: Mod) {
  return mod.errors.length > 0;
}

export function toggleEnabled(mod: Mod) {
  const config = getConfig(mod);
  if (!config) {
    return;
  }
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
