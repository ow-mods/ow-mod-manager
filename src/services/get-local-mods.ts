import fs from 'fs';
import glob from 'glob-promise'

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

async function getLocalMods(): Promise<Mod[]> {

  const modManifestPaths = await glob(`${MODS_DIR}/**/manifest.json`);
  const manifestJsons = modManifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
  const manifests = manifestJsons.map(json => JSON.parse(json));

  const mods: Mod[] = manifests.map(manifest => ({
    name: manifest.name,
    author: manifest.author,
    version: manifest.version,
  }));

  return mods;
}

export default getLocalMods;
