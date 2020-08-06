import fetch from 'node-fetch';

import { modsText } from '../static-text';
import { manifestPartialToFull } from '.';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Partial<Manifest>;
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

export async function getModDatabase(
  url: string,
  owmlPath: string,
): Promise<ModDatabase> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }

  const { releases, modManager }: RemoteModDatabase = await response.json();

  const mods = releases.map(
    ({
      manifest: partialManifest,
      downloadCount,
      downloadUrl,
      repo,
    }: RemoteMod) => {
      const { manifest, missingAttributes } = manifestPartialToFull(
        partialManifest,
      );

      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        remoteVersion: manifest.version,
        modPath: `${owmlPath}/Mods/${manifest.uniqueName}`,
        errors: [],
        downloadUrl,
        downloadCount,
        repo,
        dependencies: manifest.dependencies ?? [],
      };

      if (missingAttributes.length > 0) {
        mod.errors.push(
          modsText.missingManifestAttributesError(repo, missingAttributes),
        );
      }

      return mod;
    },
  );

  return {
    mods,
    modManager,
  };
}
