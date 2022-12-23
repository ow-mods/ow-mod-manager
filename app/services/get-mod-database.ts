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
  alpha?: boolean;
  authorDisplay?: string;
  tags: string[];
};

type RemoteModDatabase = {
  releases: RemoteMod[];
  alphaReleases: RemoteMod[];
  modManager: ModManager;
};

export type ModDatabase = {
  mods: Mod[];
  modManager: ModManager;
};

export async function getModDatabase(
  url: string,
  owmlPath: string,
  alphaPath: string
): Promise<ModDatabase> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }

  const {
    releases,
    alphaReleases,
    modManager,
  } = (await response.json()) as RemoteModDatabase;

  const allReleases = [...releases, ...alphaReleases];

  const mods = allReleases.map(
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
      alpha,
      authorDisplay,
      tags,
    }: RemoteMod) => {
      // TODO doesnt make sense for this to be here in remote mods
      const modPath = alpha
        ? `${alphaPath}/BepInEx/plugins/${uniqueName}`
        : `${owmlPath}/Mods/${uniqueName}`;
      const mod: Mod = {
        name,
        author,
        uniqueName,
        parent,
        remoteVersion: coerce(version)?.version ?? version,
        modPath,
        errors: [],
        downloadUrl,
        downloadCount,
        repo,
        dependencies: [],
        isRequired: required,
        description,
        prerelease,
        authorDisplay,
        addons: allReleases
          .filter((release) => release.parent === uniqueName)
          .map((addon) => addon.uniqueName),
        isAlpha: alpha,
        tags,
      };

      return mod;
    }
  );

  return {
    mods,
    modManager,
  };
}
