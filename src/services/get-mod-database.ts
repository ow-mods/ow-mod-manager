import axios from 'axios';

import config from '../config.json';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
};

export async function getModDatabase(): Promise<Mod[]> {
  return axios.get(config.modDatabaseUrl).then(({ data }) =>
    data.map(({ manifest, downloadCount, downloadUrl }: RemoteMod) => {
      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        remoteVersion: manifest.version,
        modPath: `${config.owmlPath}/Mods/${manifest.name}`,
        downloadUrl: downloadUrl,
        downloadCount: downloadCount,
        //repo?: string, // TODO missing repo
        isLoading: false,
      };

      return mod;
    }),
  );
}
