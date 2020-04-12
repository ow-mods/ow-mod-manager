import fs from 'fs-extra';
import config from '../config.json';

function getLocalOwml() {
  const owmlManifestPath = `${config.owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? fs.readJSONSync(owmlManifestPath)
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: config.owmlPath,
    localVersion: owmlManifest?.version ?? '< 0.3.43',
    isLoading: false,
  };
  return owml;
}

export default getLocalOwml;
