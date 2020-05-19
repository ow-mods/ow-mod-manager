import fs from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';

import config from '../config.json';
import { isEnabled } from '.';

function getOwml() {
  const owmlManifestPath = `${config.owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? fs.readJSONSync(owmlManifestPath)
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: config.owmlPath,
    localVersion: owmlManifest
      ? owmlManifest?.version ?? '< 0.3.43'
      : undefined,
    isEnabled: true,
    isRequired: true,
  };
  return owml;
}

export async function getLocalMods(): Promise<ModMap> {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);
  const manifestFiles = manifestPaths.map((manifestPath) => ({
    path: manifestPath,
    manifest: fs.readJSONSync(manifestPath),
  }));

  const modMap: ModMap = manifestFiles.reduce<ModMap>(
    (accumulator, manifestFile): ModMap => {
      const mod: Mod = {
        name: manifestFile.manifest.name,
        author: manifestFile.manifest.author,
        uniqueName: manifestFile.manifest.uniqueName,
        modPath: path.dirname(manifestFile.path),
        localVersion: manifestFile.manifest.version,
      };

      mod.isEnabled = isEnabled(mod);

      return {
        ...accumulator,
        [mod.uniqueName]: mod,
      };
    },
    {},
  );

  const owml = getOwml();
  modMap[owml.uniqueName] = owml;

  return modMap;
}
