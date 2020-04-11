
import getRemoteRelease from './get-remote-release';
import getRemoteManifest from './get-remote-manifest';
import config from '../config.json';

async function getRemoteMod(modDbItem: ModDbItem): Promise<Mod> {
  const release = await getRemoteRelease(modDbItem.repo);
  const manifest = await getRemoteManifest(modDbItem);
  const remoteMod: Mod = {
    name: manifest.name,
    author: manifest.author,
    uniqueName: manifest.uniqueName,
    modPath: `${config.owmlPath}/Mods/${manifest.name}`,
    remoteVersion: manifest.version,
    downloadUrl: release.downloadUrl,
    downloadCount: release.downloadCount,
    isLoading: false,
  };
  return remoteMod;
}

export default getRemoteMod;
