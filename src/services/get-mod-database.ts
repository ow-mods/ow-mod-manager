import fetch from 'node-fetch';

import config from '../config.json';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
  repo: string;
};

type RemoteModDatabase = {
  releases: RemoteMod[];
  modManager: AppRelease;
};

type ModDatabase = {
  mods: Mod[];
  modManager: AppRelease;
};

export async function getModDatabase(url: string): Promise<ModDatabase> {
  const response = await fetch(url);
  const { releases, modManager }: RemoteModDatabase = await response.json();

  const mods = releases.map(
    ({ manifest, downloadCount, downloadUrl, repo }: RemoteMod) => {
      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        remoteVersion: manifest.version,
        modPath: `${config.owmlPath}/Mods/${manifest.name}`,
        downloadUrl,
        downloadCount,
        repo,
        errors: [],
      };

      return mod;
    },
  );

  return {
    mods,
    modManager,
  };
}
