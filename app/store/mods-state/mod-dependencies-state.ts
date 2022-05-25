import { selector, selectorFamily } from 'recoil';
import { flatten } from 'lodash';

import { localModMap } from './mods-state';

export const missingDependencyIdsState = selectorFamily({
  key: 'MissingDependencyIds',
  get: (mod: Mod) => ({ get }) => {
    // TODO isEnabled as family too?
    if (!mod.isEnabled) {
      return [];
    }
    const missingDependencies = [];
    for (let i = 0; i < mod.dependencies.length; i += 1) {
      const dependencyUniqueName = mod.dependencies[i];
      const dependency = get(localModMap)[dependencyUniqueName];
      if (!dependency?.isEnabled) {
        missingDependencies.push(dependency?.name ?? dependencyUniqueName);
      }
    }
    return missingDependencies;
  },
});

export const requiredDependencyIdsState = selector({
  key: 'RequiredDependencyIds',
  get: ({ get }) =>
    flatten(
      Object.values(get(localModMap))
        .filter((mod) => mod.isEnabled)
        .map((mod) => mod.dependencies)
    ),
});
