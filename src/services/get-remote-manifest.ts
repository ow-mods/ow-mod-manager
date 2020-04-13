import axios from 'axios';

async function getRemoteManifest(modDbItem: ModDbItem): Promise<Manifest> {
  return axios
    .get(
      `https://raw.githubusercontent.com/${modDbItem.repo}/master/${modDbItem.manifest}`,
    )
    .then((response) => {
      const { data } = response;

      const manifest: Manifest = {
        name: data.name,
        author: data.author,
        uniqueName: data.uniqueName,
        version: data.version,
      };

      return manifest;
    });
}

export default getRemoteManifest;
