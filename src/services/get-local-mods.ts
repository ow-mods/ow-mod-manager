import fs from 'fs';
import config from '../config.json';

function getLocalMods(): Mod[] {
  const modsFolder = `${config.owmlPath}/Mods`;
  const installedModFolders = fs.readdirSync(modsFolder);
  const modManifestPaths = installedModFolders.map(folder => `${modsFolder}/${folder}/manifest.json`);
  const manifestJsons = modManifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
  const manifests = manifestJsons.map(json => JSON.parse(json));

  const mods: Mod[] = manifests.map(manifest => ({
    name: manifest.name,
    author: manifest.author,
    version: manifest.version,
  }))

  return mods;
}

export default getLocalMods;
