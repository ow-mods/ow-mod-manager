function cleanID(id: string) {
  let cleanedID = id.toUpperCase();
  cleanedID = cleanedID.replace(/\t/, '');
  cleanedID = cleanedID.replace(/\n/, '');
  cleanedID = cleanedID.replace(/\r/, '');
  cleanedID = cleanedID.replace(/\b/, '');
  cleanedID = cleanedID.replace(/\f/, '');
  cleanedID = cleanedID.replace('-', '');
  const n = cleanedID.indexOf('-');
  cleanedID = cleanedID.substring(0, n !== -1 ? n : cleanedID.length);
  return cleanedID.replace(/[^a-zA-Z0-9]/, '');
}

function versionCompare(v1: string, v2: string) {
  const version1 = cleanID(v1);
  const version2 = cleanID(v2);
  const v1parts = version1.split('.');
  const v2parts = version2.split('.');

  function isValidPart(x: string) {
    return /^\d+$/.test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  const v1partsN = v1parts.map(Number);
  const v2partsN = v2parts.map(Number);

  while (v1partsN.length < v2partsN.length) v1partsN.push(0);
  while (v2partsN.length < v1partsN.length) v2partsN.push(0);

  for (let i = 0; i < v1partsN.length; i += 1) {
    if (v2partsN.length === i) {
      return 1;
    }

    if (v1partsN[i] > v2partsN[i]) {
      return 1;
    }
    if (v1partsN[i] < v2partsN[i]) {
      return -1;
    }
  }

  if (v1partsN.length !== v2partsN.length) {
    return -1;
  }

  return 0;
}

function areEqual(a: string, b: string) {
  return versionCompare(a, b) === 0;
}

function isLessThan(a: string, b: string) {
  return versionCompare(a, b) === -1;
}

function isGreaterThan(a: string, b: string) {
  return versionCompare(a, b) === 1;
}

function isLessThanOrEqualTo(a: string, b: string) {
  return versionCompare(a, b) <= 0;
}

function isGreaterThanOrEqualTo(a: string, b: string) {
  return versionCompare(a, b) >= 0;
}

function isBetweenMinAndMax(current: string, minimum: string, maximum: string) {
  const minCompare = versionCompare(current, minimum);
  const maxCompare = versionCompare(current, maximum);
  if (
    minCompare === 0 ||
    maxCompare === 0 ||
    (minCompare === 1 && maxCompare === -1) ||
    (minCompare === -1 && maxCompare === 1)
  )
    return true;
  return false;
}

export const versionComparer = {
  areEqual,
  isGreaterThan,
  isGreaterThanOrEqualTo,
  isLessThan,
  isLessThanOrEqualTo,
  isBetweenMinAndMax,
};
