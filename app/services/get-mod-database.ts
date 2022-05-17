import { coerce } from 'semver';

type RemoteMod = {
  downloadUrl: string;
  downloadCount: number;
  name: string;
  author: string;
  uniqueName: string;
  description?: string;
  repo: string;
  parent?: string;
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
      downloadCount,
      downloadUrl,
      required,
      repo,
      version,
      prerelease,
      author,
      name,
      uniqueName,
      description,
      parent,
    }: RemoteMod) => {
      const mod: Mod = {
        name,
        author,
        uniqueName,
        parent,
        remoteVersion: coerce(version)?.version ?? version,
        // TODO doesnt make sense for this to be here in remote mods
        modPath: `${owmlPath}/Mods/${uniqueName}`,
        errors: [],
        downloadUrl,
        downloadCount,
        repo,
        dependencies: [],
        isRequired: required,
        description,
        prerelease,
        addons: releases
          .filter((release) => release.parent === uniqueName)
          .map((addon) => addon.uniqueName),
      };

      return mod;
    }
  );

  return {
    mods,
    modManager,
  };
}
