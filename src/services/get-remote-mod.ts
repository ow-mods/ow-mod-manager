import { getRemoteRelease, getRemoteManifest } from '.';
import config from '../config.json';

export async function getRemoteMod(modDbItem: ModDbItem): Promise<Mod> {
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
    repo: modDbItem.repo,
  };
  return remoteMod;
}
