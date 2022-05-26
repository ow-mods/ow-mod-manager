import { shell, remote } from 'electron';
import fs from 'fs-extra';

import { modsText, globalText } from '../helpers/static-text';
import { getConfig, saveConfig } from './mod-config';
import {
  unzipRemoteFile,
  deleteFolder,
  openDirectory,
  deleteFolderExcept,
  copyFolder,
} from './files';
import { manifestPartialToFull } from './manifest';

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

export function cleanup(mod: Mod, tempManifestPath: string) {
  if (!mod.modPath) return;

  let pathsToPreserve: string[] | undefined = [];

  // Get pathsToPreserve from the version being installed, not the local version
  try {
    const { manifest } = manifestPartialToFull(
      fs.readJsonSync(tempManifestPath)
    );
    pathsToPreserve = manifest.pathsToPreserve;
  } catch (error) {
    pathsToPreserve = mod.pathsToPreserve;
  }

  let pathsToKeep;

  if (mod.uniqueName === 'Alek.OWML') {
    pathsToKeep = ['Mods', 'OWML.Config.json', 'OWML.Manifest.json'];
  } else if (mod.uniqueName === 'bbepis.BepInEx') {
    pathsToKeep = [
      'BepInEx',
      'OuterWilds_Alpha_1_2_Data',
      'OuterWilds_Alpha_1_2.exe',
      'BepInEx.Manifest.json',
    ];
  } else if (mod.uniqueName === 'Locochoco.OWAML') {
    pathsToKeep = ['OWAML.Manifest.json'];
  } else {
    pathsToKeep = ['config.json', 'save.json', 'manifest.json'].concat(
      pathsToPreserve ?? []
    );
  }

  deleteFolderExcept(mod.modPath, pathsToKeep);
}

export async function install(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.downloadUrl) {
    return;
  }

  const [temporaryPath, unzipPath] = await unzipRemoteFile(
    mod,
    mod.downloadUrl,
    onProgress
  );

  if (mod.localVersion) {
    cleanup(mod, `${unzipPath}/manifest.json`);
  }

  await copyFolder(unzipPath, mod.modPath);
  deleteFolder(temporaryPath);
}

async function upstallPrerelease(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.prerelease) {
    return;
  }

  const [temporaryPath, unzipPath] = await unzipRemoteFile(
    mod,
    mod.prerelease.downloadUrl,
    onProgress
  );

  if (mod.localVersion) {
    cleanup(mod, `${unzipPath}/manifest.json`);
  }

  await copyFolder(unzipPath, mod.modPath);
  deleteFolder(temporaryPath);
}

export async function installPrerelease(mod: Mod, onProgress: ProgressHandler) {
  await upstallPrerelease(mod, onProgress);
}

async function showPatcherWarning(mod: Mod): Promise<boolean> {
  if (!mod.patcher) return true;

  const { response } = await remote.dialog.showMessageBox({
    type: 'warning',
    title: mod.name,
    message: modsText.patcherWarning(mod.name),
    buttons: [globalText.dialog.ok, globalText.dialog.cancel],
  });

  return response === 0;
}

export async function uninstall(mod: Mod, isReinstall = false) {
  if (!isInstalled(mod)) {
    throw new Error(modsText.uninstallNotInstalledError);
  }

  if (!isReinstall && !(await showPatcherWarning(mod))) {
    return;
  }

  deleteFolder(mod.modPath);
}

export async function reinstall(mod: Mod, onProgress: ProgressHandler) {
  uninstall(mod, true);
  install(mod, onProgress);
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

export function openReadme(mod: Mod) {
  if (!mod.repo) {
    throw new Error(modsText.undefinedRepoUrlError);
  }
  shell.openExternal(`${mod.repo}#readme`);
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

export async function toggleEnabled(mod: Mod) {
  const config = getConfig(mod);
  if (!config || (config.enabled && !(await showPatcherWarning(mod)))) {
    return;
  }
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
