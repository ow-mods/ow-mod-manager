function getManifestAttribute(
  key: keyof Manifest,
  isUnique?: boolean,
  errorIdentifier: string,
) {
  const value = manifest[key];
  if (value) {
    return value;
  }
  errors.push(`Manifest "${manifestPath}" is missing attribute "${key}"`);
  return `[Missing ${key}]${isUnique ? uniqueId() : ''}`;
}
