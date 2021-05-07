import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { coerce } from 'semver';

import { modsText } from '../static-text';
import { isEnabled } from './mod-manager';
import { manifestPartialToFull } from './manifest';

function getOwmlSync(owmlPath: string) {
  const owmlManifestPath = `${owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? fs.readJSONSync(owmlManifestPath)
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: owmlPath,
    localVersion: owmlManifest
      ? owmlManifest?.version ?? '< 0.3.43'
      : undefined,
    isEnabled: true,
    isRequired: true,
    errors: [],
    dependencies: [],
    description: owmlManifest?.description,
  };
  return owml;
}

export function getLocalModsSync(owmlPath: string) {
  if (!owmlPath) {
    return [];
  }

  const manifestPaths = globby.sync(`**/manifest.json`, {
    cwd: `${owmlPath}/Mods`,
    absolute: true,
  });

  return [
    ...manifestPaths
      .map<Mod>((manifestPath) => {
        const { manifest, missingAttributes } = manifestPartialToFull(
          fs.readJsonSync(manifestPath)
        );

        const mod: Mod = {
          name: manifest.name,
          author: manifest.author,
          uniqueName: manifest.uniqueName,
          localVersion: coerce(manifest.version)?.version ?? manifest.version,
          modPath: path.dirname(manifestPath),
          errors: [],
          dependencies: manifest.dependencies ?? [],
          requireVR: manifest.requireVR,
          description: manifest.description,
        };

        if (missingAttributes.length > 0) {
          mod.errors.push(
            modsText.missingManifestAttributesError(
              manifestPath,
              missingAttributes
            )
          );
        }

        try {
          mod.isEnabled = isEnabled(mod);
        } catch (error) {
          mod.isEnabled = true;
          console.error(error);
        }
        return mod;
      })
      .filter((mod) => mod),
    getOwmlSync(owmlPath),
  ];
}
