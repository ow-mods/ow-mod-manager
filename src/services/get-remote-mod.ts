
import getRemoteRelease from './get-remote-release';
import getRemoteManifest from './get-remote-manifest';

async function getRemoteMod(modDbItem: ModDbItem): Promise<Mod> {
  const release = await getRemoteRelease(modDbItem.repo);
  const manifest = await getRemoteManifest(modDbItem);
  const remoteMod: Mod = {
    name: manifest.name,
    author: manifest.author,
    uniqueName: manifest.uniqueName,
    folderName: manifest.name,
    remoteVersion: manifest.version,
    downloadUrl: release.downloadUrl,
    downloadCount: release.downloadCount,
  };
  return remoteMod;
}

export default getRemoteMod;
