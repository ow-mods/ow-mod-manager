
import axios from 'axios';
import { Dictionary } from 'lodash';

const timeout = 60000;
const cachedData: Dictionary<Release> = {};
let cachedTime: Date;

async function getRemoteRelease(repo: string): Promise<Release> {
  if (cachedData
    && Object.keys(cachedData.keys).includes(repo)
    && cachedTime
    && (new Date().getTime() - cachedTime.getTime()) < timeout) {
    return cachedData[repo];
  }

  return axios.get(`https://api.github.com/repos/${repo}/releases/latest`)
    .then((response) => {
      const { data } = response;

      const release: Release = {
        downloadUrl: data.assets[0].browser_download_url,
        downloadCount: data.assets[0].download_count,
      };

      cachedData[repo] = release;
      cachedTime = new Date();
      return release;
    });
}

export default getRemoteRelease;
