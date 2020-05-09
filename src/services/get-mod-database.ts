import axios from 'axios';

import config from '../config.json';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
};

export async function getModDatabase(): Promise<RemoteMod[]> {
  return axios.get(config.modDatabaseUrl).then(({ data }) => data);
}
