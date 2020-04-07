import fs from 'fs';
import { Mod } from '../models/mod';
import { Manifest } from '../models/manifest';

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

function getLocalManifests(): Manifest[] {
  const installedModFolders = fs.readdirSync(MODS_DIR);
  const modManifestPaths = installedModFolders.map(folder => `${MODS_DIR}/${folder}/manifest.json`);
  const manifestJsons = modManifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
  const manifests = manifestJsons.map<Manifest>(json => JSON.parse(json));
  return manifests;
}

export default getLocalManifests;
