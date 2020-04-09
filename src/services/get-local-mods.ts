import fs from 'fs';
import glob from 'glob-promise'
import config from '../config.json';

async function getLocalMods(): Promise<Mod[]> {
  
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);
  const manifestJsons = manifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
  const manifests = manifestJsons.map(json => JSON.parse(json));

  const mods: Mod[] = manifests.map(manifest => ({
    name: manifest.name,
    author: manifest.author,
    version: manifest.version,
  }));

  return mods;
}

export default getLocalMods;
