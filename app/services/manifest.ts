import { uniqueId } from 'lodash';

export function manifestPartialToFull(partialManifest: Partial<Manifest>) {
  const missingAttributes: string[] = [];

  function getAttribute(
    key: keyof Manifest,
    isUnique?: boolean,
    isOptional?: boolean
  ): string {
    const value = partialManifest[key];
    if (value) {
      return value as string;
    }
    if (isOptional) {
      return '';
    }
    missingAttributes.push(key);
    return `[Missing ${key}]${isUnique ? uniqueId() : ''}`;
  }

  const manifest: Manifest = {
    name: getAttribute('name'),
    author: getAttribute('author'),
    uniqueName: getAttribute('uniqueName', true),
    version: getAttribute('version'),
    dependencies: partialManifest.dependencies ?? [],
    warning: partialManifest.warning,
    patcher: partialManifest.patcher,
    conflicts: partialManifest.conflicts,
    pathsToPreserve: partialManifest.pathsToPreserve,
    minBepInExVersion: getAttribute('minBepInExVersion', false, true),
    maxBepInExVersion: getAttribute('maxBepInExVersion', false, true),
  };

  return {
    manifest,
    missingAttributes,
  };
}
