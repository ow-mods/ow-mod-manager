import fs from 'fs';
import glob from 'glob-promise';
import path from 'path';
import config from '../config.json';

async function getLocalMods(): Promise<ModMap> {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);
  const manifestFiles = manifestPaths.map((manifestPath) => ({
    path: manifestPath,
    manifest: JSON.parse(fs.readFileSync(manifestPath, { encoding: 'UTF-8' })),
  }));

  const modMap: ModMap = manifestFiles.reduce<ModMap>((accumulator, manifestFile): ModMap => ({
    ...accumulator,
    [manifestFile.manifest.uniqueName]: {
      name: manifestFile.manifest.name,
      author: manifestFile.manifest.author,
      uniqueName: manifestFile.manifest.uniqueName,
      modPath: path.dirname(manifestFile.path),
      localVersion: manifestFile.manifest.version,
      isLoading: false,
    },
  }), {});

  const owmlManifestPath = `${config.owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? JSON.parse(fs.readFileSync(owmlManifestPath, { encoding: 'UTF-8' }))
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: config.owmlPath,
    localVersion: owmlManifest?.version ?? '< 0.3.43',
    isLoading: false,
  };
  modMap[owml.uniqueName] = owml;

  return modMap;
}

export default getLocalMods;
