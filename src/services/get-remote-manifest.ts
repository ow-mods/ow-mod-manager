
import axios from 'axios';

async function getRemoteManifest(modDbItem: ModDbItem): Promise<Manifest> {
  const branch = modDbItem.repo === 'amazingalek/owml' ? 'owml-manifest' : 'master'; // todo
  const url = `https://raw.githubusercontent.com/${modDbItem.repo}/${branch}/${modDbItem.manifest}`;
  return axios.get(url)
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
