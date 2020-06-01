import fs from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';

import { isEnabled, manifestPartialToFull } from '.';

export async function getLocalManifestPaths(owmlPath: string) {
  return glob(`${owmlPath}/Mods/**/manifest.json`);
}

export async function getLocalMod(manifestPath: string) {
  const { manifest, missingAttributes } = manifestPartialToFull(
    await fs.readJson(manifestPath),
  );

  const mod: Mod = {
    name: manifest.name,
    author: manifest.author,
    uniqueName: manifest.uniqueName,
    localVersion: manifest.version,
    modPath: path.dirname(manifestPath),
    errors: [],
  };

  if (missingAttributes.length > 0) {
    mod.errors.push(
      `Manifest ${manifestPath} missing attributes "${missingAttributes.join(
        '", "',
      )}"`,
    );
  }

  try {
    mod.isEnabled = isEnabled(mod);
  } catch (error) {
    mod.errors.push(`${error}`);
  } finally {
    return mod;
  }
}
