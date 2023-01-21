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
import { sendEvent } from './analytics';

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

async function install(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.downloadUrl) {
    return;
  }

  const [temporaryPath, unzipInnerPath] = await unzipRemoteFile(
    mod,
    mod.downloadUrl,
    onProgress
  );

  if (mod.localVersion) {
    cleanup(mod, `${unzipInnerPath}/manifest.json`);
  }

  await copyFolder(unzipInnerPath, mod.modPath);
  deleteFolder(temporaryPath);
}

export async function installNew(mod: Mod, onProgress: ProgressHandler) {
  await install(mod, onProgress);

  sendEvent('mod_install', { mod_unique_name: mod.uniqueName });
}

export async function installUpdate(mod: Mod, onProgress: ProgressHandler) {
  await install(mod, onProgress);

  sendEvent('mod_update', { mod_unique_name: mod.uniqueName });
}

export async function installRequired(mod: Mod, onProgress: ProgressHandler) {
  await install(mod, onProgress);

  sendEvent('mod_required_install', { mod_unique_name: mod.uniqueName });
}

async function upstallPrerelease(mod: Mod, onProgress: ProgressHandler) {
  if (!mod.prerelease) {
    return;
  }

  const [temporaryPath, unzipInnerPath] = await unzipRemoteFile(
    mod,
    mod.prerelease.downloadUrl,
    onProgress
  );

  if (mod.localVersion) {
    cleanup(mod, `${unzipInnerPath}/manifest.json`);
  }

  await copyFolder(unzipInnerPath, mod.modPath);
  deleteFolder(temporaryPath);
}

export async function installPrerelease(mod: Mod, onProgress: ProgressHandler) {
  await upstallPrerelease(mod, onProgress);
  sendEvent('mod_prerelease_install', { mod_unique_name: mod.uniqueName });
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
  await uninstall(mod, true);
  await install(mod, onProgress);

  sendEvent('mod_reinstall', { mod_unique_name: mod.uniqueName });
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

export async function setEnabled(mod: Mod, enabled: boolean) {
  const config = getConfig(mod);
  if (!config || (config.enabled && !(await showPatcherWarning(mod)))) {
    return;
  }
  config.enabled = enabled;
  saveConfig(mod, config);
}
