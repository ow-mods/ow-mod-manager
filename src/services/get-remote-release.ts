
import axios from 'axios';

async function getRemoteRelease(repo: string): Promise<Release> {
  return axios.get(`https://api.github.com/repos/${repo}/releases/latest`)
    .then((response) => {
      const { data } = response;

      const release: Release = {
        downloadUrl: data.assets[0].browser_download_url,
        downloadCount: data.assets
          .map((asset: { download_count: number }) => asset.download_count)
          .reduce((a: number, b: number) => a + b),
      };

      return release;
    });
}

export default getRemoteRelease;
