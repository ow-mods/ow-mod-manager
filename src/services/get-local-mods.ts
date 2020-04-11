import fs from 'fs';
import glob from 'glob-promise';
import config from '../config.json';

async function getLocalMods(): Promise<ModMap> {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);
  manifestPaths.push(`${config.owmlPath}/OWML.Manifest.json`);
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
      folderName: manifestFile.path.replace(`${config.owmlPath}/Mods/`, '').split('/')[0],
      localVersion: manifestFile.manifest.version,
      isLoading: false,
    },
  }), {});

  return modMap;
}

export default getLocalMods;
