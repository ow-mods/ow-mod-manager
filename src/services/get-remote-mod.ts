
import axios from 'axios';

async function getRemoteMod(repo: string): Promise<Mod> {
  return axios.get(`https://api.github.com/repos/${repo}/releases/latest`)
    .then(response => {
      const { data } = response;

      const mod: Mod = {
        name: data.name,
        author: data.author.login,
        version: data.tag_name,
        downloads: 0,
      };

      return mod;
    });
};

export default getRemoteMod;
