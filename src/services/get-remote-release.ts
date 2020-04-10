
import axios from 'axios';

async function getRemoteRelease(repo: string): Promise<Release> {
  return axios.get(`https://api.github.com/repos/${repo}/releases`)
    .then((response) => {
      const { data } = response;

      const release: Release = {
        downloadUrl: data[0].assets[0].browser_download_url,
        downloadCount: data
          .map((rel: Rel) => (rel.assets.length > 0 ? rel.assets[0].download_count : 0))
          .reduce((a: number, b: number) => a + b, 0),
      };

      return release;
    });
}

export default getRemoteRelease;

type Rel = {
  assets: {
    download_count: number;
  }[];
};
