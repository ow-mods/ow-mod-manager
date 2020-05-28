import fs from 'fs-extra';
import glob from 'glob-promise';
import path from 'path';
import { uniqueId } from 'lodash';

import config from '../config.json';
import { isEnabled } from '.';

async function getOwml() {
  const owmlManifestPath = `${config.owmlPath}/OWML.Manifest.json`;
  const owmlManifest: Manifest = fs.existsSync(owmlManifestPath)
    ? await fs.readJSON(owmlManifestPath)
    : null;
  const owml: Mod = {
    name: owmlManifest?.name ?? 'OWML',
    author: owmlManifest?.author ?? 'Alek',
    uniqueName: owmlManifest?.uniqueName ?? 'Alek.OWML',
    modPath: config.owmlPath,
    localVersion: owmlManifest
      ? owmlManifest?.version ?? '< 0.3.43'
      : undefined,
    isEnabled: true,
    isRequired: true,
    errors: [],
  };
  return owml;
}

export async function getLocalMods() {
  const manifestPaths = await glob(`${config.owmlPath}/Mods/**/manifest.json`);

  return Promise.allSettled([
    ...manifestPaths.map<Promise<Mod>>(async (manifestPath) => {
      const manifest: Manifest = await fs.readJson(manifestPath);

      const missingAttributes: string[] = [];

      function getAttribute(key: keyof Manifest, isUnique?: boolean) {
        const value = manifest[key];
        if (value) {
          return value;
        }
        missingAttributes.push(key);
        return `[Missing ${key}]${isUnique ? uniqueId() : ''}`;
      }

      const mod: Mod = {
        name: getAttribute('name'),
        author: getAttribute('author'),
        uniqueName: getAttribute('uniqueName'),
        localVersion: getAttribute('version'),
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
        mod.errors.push(error);
      } finally {
        return mod;
      }
    }),
    getOwml(),
  ]);
}
