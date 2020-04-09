import fs from 'fs';
import glob from 'glob-promise'
import config from '../config.json';

async function getLocalMods(): Promise<ModMap> {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);
  const manifestJsons = manifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));

  const manifests: Manifest[] = manifestJsons.map(json => JSON.parse(json));

  const modMap: ModMap = manifests.reduce((accumulator, manifest) => ({
    ...accumulator,
    [manifest.uniqueName]: {
      name: manifest.name,
      author: manifest.author,
      uniqueName: manifest.uniqueName,
      version: manifest.version,
    },
  }), {})

  return modMap;
}

export default getLocalMods;
