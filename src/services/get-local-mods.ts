import fs from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';

import config from '../config.json';
import { isEnabled } from './mod-enabler';

async function getLocalMods(): Promise<ModMap> {
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
        isLoading: false,
      };

      mod.isEnabled = isEnabled(mod);

      return {
        ...accumulator,
        [mod.uniqueName]: mod,
      };
    },
    {},
  );

  return modMap;
}

export default getLocalMods;
