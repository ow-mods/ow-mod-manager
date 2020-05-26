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

export async function getLocalMods() {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);

  return Promise.allSettled(
    manifestPaths.map<Promise<Mod>>(async (manifestPath) => {
      const manifest: Manifest = await fs.readJson(manifestPath);

      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        modPath: path.dirname(manifestPath),
        localVersion: manifest.version,
      };

      mod.isEnabled = await isEnabled(mod);

      return mod;
    }),
  );
}
