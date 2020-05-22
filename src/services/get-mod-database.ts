import axios from 'axios';

import config from '../config.json';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
  repo: string;
};

export async function getModDatabase(): Promise<Mod[]> {
  return axios.get(config.modDatabaseUrl).then(({ data }) =>
    data.releases.map(
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
        };

        return mod;
      },
    ),
  );
}
