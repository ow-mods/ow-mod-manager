import fetch from 'node-fetch';

import config from '../config.json';
import { uniqueId } from 'lodash';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Manifest;
  repo: string;
};

type RemoteModDatabase = {
  releases: RemoteMod[];
  modManager: AppRelease;
};

type ModDatabase = {
  mods: Mod[];
  modManager: AppRelease;
};

export async function getModDatabase(url: string): Promise<ModDatabase> {
  const response = await fetch(url);
  const { releases, modManager }: RemoteModDatabase = await response.json();

  const mods = releases.map(
    ({ manifest, downloadCount, downloadUrl, repo }: RemoteMod) => {
      const errors: string[] = [];
      function getAttribute(key: keyof Manifest, isUnique?: boolean) {
        const value = manifest[key];
        if (value) {
          return value;
        }
        errors.push(`Manifest from "${repo}" is missing attribute "${key}"`);
        return `[Missing ${key}]${isUnique ? uniqueId() : ''}`;
      }

      const mod: Mod = {
        name: getAttribute('name'),
        author: getAttribute('author'),
        uniqueName: getAttribute('uniqueName'),
        remoteVersion: getAttribute('version'),
        modPath: `${config.owmlPath}/Mods/${manifest.uniqueName}`,
        downloadUrl,
        downloadCount,
        repo,
        errors,
      };

      return mod;
    },
  );

  return {
    mods,
    modManager,
  };
}
