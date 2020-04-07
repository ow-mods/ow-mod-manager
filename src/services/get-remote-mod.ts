
import getRemoteRelease from './get-remote-release';
import getRemoteManifest from './get-remote-manifest';
import { Mod } from '../mod';

async function getRemoteMod(modDbItem: ModDbItem): Promise<Mod> {
  const release = await getRemoteRelease(modDbItem.repo);
  const manifest = await getRemoteManifest(modDbItem);
  const remoteMod = new Mod();
  remoteMod.remoteManifest = manifest;
  remoteMod.release = release;
  return remoteMod;
};

export default getRemoteMod;
