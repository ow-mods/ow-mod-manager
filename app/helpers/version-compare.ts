function cleanID(id : string) {
    id = id.toUpperCase();
    id = id.replace( /\t/ , "");
    id = id.replace( /\n/ , "");
    id = id.replace( /\r/ , "");
    id = id.replace( /\b/ , "");
    id = id.replace( /\f/ , "");
    id = id.replace("-", "");
    var n = id.indexOf('-');
    id = id.substring(0, n != -1 ? n : id.length);
    return id.replace( /[^a-zA-Z0-9]/ , "");
}

function versionCompare(v1 : string, v2 : string) {
    var version1 = cleanID(v1);
    var version2 = cleanID(v2);
    var v1parts = version1.split('.'),
        v2parts = version2.split('.');

    function isValidPart(x : string) {
        return  /^\d+$/.test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    var v1partsN = v1parts.map(Number);
    var v2partsN = v2parts.map(Number);

    while (v1partsN.length < v2partsN.length) v1partsN.push(0);
    while (v2partsN.length < v1partsN.length) v2partsN.push(0);

    for (var i = 0; i < v1partsN.length; ++i) {
        if (v2partsN.length == i) {
            return 1;
        }

        if (v1partsN[i] == v2partsN[i]) {
            continue;
        }
        else if (v1partsN[i] > v2partsN[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1partsN.length != v2partsN.length) {
        return -1;
    }

    return 0;
}

function areEqual(a : string, b : string) {
    return versionCompare(a, b) == 0;
}

function isLessThan(a : string, b : string) {
    return versionCompare(a, b) == -1;
}

function isGreaterThan(a : string, b : string) {
    return versionCompare(a, b) == 1;
}

function isLessThanOrEqualTo(a : string, b : string) {
    return versionCompare(a, b) <= 0;
}

function isGreaterThanOrEqualTo(a : string, b : string) {
    return versionCompare(a, b) >= 0;
}

function isBetweenMinAndMax(current : string, minimum : string, maximum : string) {
    const minCompare = versionCompare(current, minimum);
    const maxCompare = versionCompare(current, maximum);
    if (minCompare == 0 || maxCompare == 0 || (minCompare == 1 && maxCompare == -1) || (minCompare == -1 && maxCompare == 1))
        return true;
    return false;
}

export const versionComparer = {
    areEqual: areEqual,
    isGreaterThan: isGreaterThan,
    isGreaterThanOrEqualTo: isGreaterThanOrEqualTo,
    isLessThan: isLessThan,
    isLessThanOrEqualTo: isLessThanOrEqualTo,
    isBetweenMinAndMax : isBetweenMinAndMax
};