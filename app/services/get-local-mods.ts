import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { coerce } from 'semver';

import { modsText } from '../helpers/static-text';
import { isEnabled } from './mods';
import { manifestPartialToFull } from './manifest';
import { debugConsole } from '../helpers/console-log';

function getOwml(owmlPath: string) {
  const owmlManifestPath = `${owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? fs.readJSONSync(owmlManifestPath)
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: owmlPath,
    localVersion: owmlManifest
      ? owmlManifest?.version ?? '< 0.3.43'
      : undefined,
    isEnabled: true,
    isRequired: true,
    errors: [],
    dependencies: [],
    addons: [],
  };
  return owml;
}

function getBepInEx(alphaPath: string) {
  const bepInExManifestPath = `${alphaPath}/BepInEx.Manifest.json`;
  const bepInExManifest: Manifest = fs.existsSync(bepInExManifestPath)
    ? fs.readJSONSync(bepInExManifestPath)
    : null;
  const bepInEx: Mod = {
    name: bepInExManifest?.name ?? 'BepInEx',
    author: bepInExManifest?.author ?? 'bbepis',
    uniqueName: bepInExManifest?.uniqueName ?? 'bbepis.BepInEx',
    modPath: alphaPath,
    localVersion: bepInExManifest
      ? bepInExManifest?.version ?? 'v5.4.19'
      : undefined,
    isEnabled: true,
    isRequired: true,
    errors: [],
    dependencies: [],
    addons: [],
    isAlpha: true,
  };
  return bepInEx;
}

function getOwaml(owamlPath: string) {
  const owamlManifestPath = `${owamlPath}/OWAML.Manifest.json`;
  const owamlManifest: Manifest = fs.existsSync(owamlManifestPath)
    ? fs.readJSONSync(owamlManifestPath)
    : null;
  const owaml: Mod = {
    name: owamlManifest?.name ?? 'OWAML',
    author: owamlManifest?.author ?? 'Locochoco',
    uniqueName: owamlManifest?.uniqueName ?? 'Locochoco.OWAML',
    modPath: owamlPath,
    localVersion: owamlManifest
      ? owamlManifest?.version ?? 'v1.0.1'
      : undefined,
    isEnabled: true,
    isRequired: true,
    errors: [],
    dependencies: ['bbepis.BepInEx'],
    addons: [],
    isAlpha: true,
  };
  return owaml;
}

function pushModsFromDirectory(
  localMods: Mod[],
  directory: string,
  isAlpha?: boolean
) {
  const manifestPaths = globby.sync(`**/manifest.json`, {
    cwd: directory,
    absolute: true,
  });

  manifestPaths.forEach((manifestPath) => {
    const modPath = path.dirname(manifestPath);
    try {
      const { manifest, missingAttributes } = manifestPartialToFull(
        fs.readJsonSync(manifestPath)
      );

      const modWithSameId = localMods.find(
        (localMod) => localMod.uniqueName === manifest.uniqueName
      );
      if (modWithSameId) {
        modWithSameId.errors.push(
          modsText.duplicateModError(manifest.uniqueName)
        );
        return;
      }

      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        localVersion: coerce(manifest.version)?.version ?? manifest.version,
        modPath,
        errors: [],
        dependencies: manifest.dependencies ?? [],
        warning: manifest.warning,
        patcher: manifest.patcher,
        conflicts: manifest.conflicts,
        pathsToPreserve: manifest.pathsToPreserve,
        addons: [],
        isAlpha,
      };

      if (missingAttributes.length > 0) {
        mod.errors.push(
          modsText.missingManifestAttributesError(
            manifestPath,
            missingAttributes
          )
        );
      }

      try {
        mod.isEnabled = isEnabled(mod);
      } catch (error) {
        mod.isEnabled = true;
        debugConsole.error(error);
      }

      localMods.push(mod);
    } catch (error) {
      const modDirectoryName = path.basename(modPath);
      localMods.push({
        author: modDirectoryName,
        dependencies: [],
        errors: [modsText.brokenManifestError(modDirectoryName, `${error}`)],
        modPath,
        name: modDirectoryName,
        uniqueName: modDirectoryName,
        localVersion: '-',
        addons: [],
        isAlpha,
      });
    }
  });
}

export function getLocalMods(
  owmlPath: string,
  alphaPath: string,
  owamlPath: string
) {
  if (!owmlPath && !alphaPath && !owamlPath) {
    return [];
  }

  const localMods: Mod[] = [];

  if (owmlPath) {
    localMods.push(getOwml(owmlPath));
    pushModsFromDirectory(localMods, `${owmlPath}/Mods`);
  }

  if (owamlPath) {
    localMods.push(getOwaml(owamlPath));
  }

  if (alphaPath) {
    localMods.push(getBepInEx(alphaPath));
    pushModsFromDirectory(localMods, `${alphaPath}/BepInEx/plugins`, true);
  }

  return [...localMods].filter((mod) => mod);
}
