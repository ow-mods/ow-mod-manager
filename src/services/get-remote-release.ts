
import axios from 'axios';
import { Dictionary } from 'lodash';

const timeout = 60000;
const cachedData: Dictionary<Release> = {};
let cachedTime: Date;

async function getRemoteRelease(repo: string): Promise<Release> {

  if (cachedData
    && Object.keys(cachedData).includes(repo)
    && cachedTime
    && (new Date().getTime() - cachedTime.getTime()) < timeout) {
    return cachedData[repo];
  }

  return axios.get(`https://api.github.com/repos/${repo}/releases`)
    .then((response) => {
      const { data } = response;

      const release: Release = {
        downloadUrl: data[0].assets[0].browser_download_url,
        downloadCount: data
          .map((rel: Rel) => (rel.assets.length > 0 ? rel.assets[0].download_count : 0))
          .reduce((a: number, b: number) => a + b, 0),
      };

      cachedData[repo] = release;
      cachedTime = new Date();
      return release;
    });
}

export default getRemoteRelease;

type Rel = {
  assets: {
    download_count: number;
  }[];
};
