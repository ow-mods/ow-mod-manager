import axios from 'axios';
import fs from 'fs-extra';

const cachePath = 'releases-cache.json';
const timeout = 60000;
let cachedData: CachedData;

function loadCache() {
  if (!fs.existsSync(cachePath)) {
    cachedData = {
      releases: {},
      time: new Date(),
    };
    fs.writeJSONSync(cachePath, cachedData);
    return;
  }
  cachedData = fs.readJSONSync(cachePath);
}

function getCachedRelease(repo: string) {
  loadCache();
  if (cachedData
    && cachedData.releases[repo]
    && cachedData.time
    && (new Date().getTime() - new Date(cachedData.time).getTime()) < timeout) {
    return cachedData.releases[repo];
  }
  return null;
}

function saveCache(repo: string, release: Release) {
  cachedData.releases[repo] = release;
  cachedData.time = new Date();
  fs.writeJSONSync(cachePath, cachedData);
}

async function getRemoteRelease(repo: string): Promise<Release> {
  const cachedRelease = getCachedRelease(repo);
  if (cachedRelease) {
    return cachedRelease;
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

      saveCache(repo, release);
      return release;
    });
}

export default getRemoteRelease;

type Rel = {
  assets: {
    download_count: number;
  }[];
};

type CachedData = {
  time: Date;
  releases: {
    [repo: string]: Release;
  };
};
