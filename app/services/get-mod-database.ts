import fetch from 'node-fetch';

import { modsText } from '../static-text';
import { manifestPartialToFull } from './manifest';

fetch.bind(window);

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Partial<Manifest>;
  repo: string;
  required?: boolean;
};

type RemoteModDatabase = {
  releases: RemoteMod[];
};

export type ModDatabase = {
  mods: Mod[];
};

// eslint-disable-next-line import/prefer-default-export
export async function getModDatabase(
  url: string,
  owmlPath: string
): Promise<ModDatabase> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }

  const { releases } = (await response.json()) as RemoteModDatabase;

  const mods = releases.map(
    ({
      manifest: partialManifest,
      downloadCount,
      downloadUrl,
      required,
      repo,
    }: RemoteMod) => {
      const { manifest, missingAttributes } = manifestPartialToFull(
        partialManifest
      );

      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        remoteVersion: manifest.version,
        // TODO doesnt make sense for this to be here in remote mods
        modPath: `${owmlPath}/Mods/${manifest.uniqueName}`,
        errors: [],
        downloadUrl,
        downloadCount,
        repo,
        dependencies: manifest.dependencies ?? [],
        isRequired: required,
      };

      if (missingAttributes.length > 0) {
        mod.errors.push(
          modsText.missingManifestAttributesError(repo, missingAttributes)
        );
      }

      return mod;
    }
  );

  return {
    mods,
  };
}
