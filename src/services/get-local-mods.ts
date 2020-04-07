import fs from 'fs';

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

function getLocalMods(): Mod[] {
  const installedModFolders = fs.readdirSync(MODS_DIR);
  const modManifestPaths = installedModFolders.map(folder => `${MODS_DIR}/${folder}/manifest.json`);
  const manifestJsons = modManifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
  const manifests = manifestJsons.map<Manifest>(json => JSON.parse(json));
  const mods: Mod[] = manifests.map(manifest => ({
    name: manifest.name,
    author: manifest.author,
    uniqueName: manifest.uniqueName,
    localVersion: manifest.version
  }));
  return mods;
}

export default getLocalMods;
