
import axios from 'axios';

async function getRemoteManifest(modDbItem: ModDbItem): Promise<Mod> {
  return axios.get(`https://raw.githubusercontent.com/${modDbItem.repo}/master/${modDbItem.manifest}`)
    .then(response => {
      const { data } = response;

      const mod: Mod = {
        name: data.name,
        author: data.author,
        version: data.version,
        downloads: 0,
      };

      return mod;
    });
};

export default getRemoteManifest;
