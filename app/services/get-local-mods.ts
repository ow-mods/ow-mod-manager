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

export function getLocalMods(owmlPath: string) {
  if (!owmlPath) {
    return [];
  }

  const manifestPaths = globby.sync(`**/manifest.json`, {
    cwd: `${owmlPath}/Mods`,
    absolute: true,
  });

  const localMods: Mod[] = [getOwml(owmlPath)];

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
      });
    }
  });

  return [...localMods].filter((mod) => mod);
}
