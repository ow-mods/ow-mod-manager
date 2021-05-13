import fetch from 'node-fetch';
import { coerce } from 'semver';

import { modsText } from '../static-text';
import { manifestPartialToFull } from './manifest';

fetch.bind(window);

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  manifest: Partial<Manifest>;
  repo: string;
  required?: boolean;
  version: string;
  prerelease?: {
    downloadUrl: string;
    version: string;
  };
};

type RemoteModDatabase = {
  releases: RemoteMod[];
  modManager: ModManager;
};

export type ModDatabase = {
  mods: Mod[];
  modManager: ModManager;
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

  const { releases, modManager } = (await response.json()) as RemoteModDatabase;

  const mods = releases.map(
    ({
      manifest: partialManifest,
      downloadCount,
      downloadUrl,
      required,
      repo,
      version,
      prerelease,
    }: RemoteMod) => {
      const { manifest, missingAttributes } = manifestPartialToFull(
        partialManifest
      );

      const mod: Mod = {
        name: manifest.name,
        author: manifest.author,
        uniqueName: manifest.uniqueName,
        remoteVersion: coerce(version)?.version ?? version,
        // TODO doesnt make sense for this to be here in remote mods
        modPath: `${owmlPath}/Mods/${manifest.uniqueName}`,
        errors: [],
        downloadUrl,
        downloadCount,
        repo,
        dependencies: manifest.dependencies ?? [],
        isRequired: required,
        description: manifest.description,
        prerelease,
        warning: manifest.warning,
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
    modManager,
  };
}
