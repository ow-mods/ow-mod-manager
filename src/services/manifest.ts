import { uniqueId } from 'lodash';

export function manifestPartialToFull(partialManifest: Partial<Manifest>) {
  const missingAttributes: string[] = [];

  function getAttribute(key: keyof Manifest, isUnique?: boolean) {
    const value = partialManifest[key];
    if (value) {
      return value;
    }
    missingAttributes.push(key);
    return `[Missing ${key}]${isUnique ? uniqueId() : ''}`;
  }

  const manifest: Manifest = {
    name: getAttribute('name'),
    author: getAttribute('author'),
    uniqueName: getAttribute('uniqueName', true),
    version: getAttribute('version'),
  };

  return {
    manifest,
    missingAttributes,
  };
}
