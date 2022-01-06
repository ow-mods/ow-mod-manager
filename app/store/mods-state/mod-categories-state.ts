import { selector } from 'recoil';

import { filteredModList } from './mod-filter-state';
import { requiredDependencyIdsState } from './mod-dependencies-state';

export const nonAddonModList = selector({
  key: 'NonAddonMods',
  get: ({ get }) => get(filteredModList).filter((mod) => !mod.parent),
});

export const addonModList = selector({
  key: 'AddonMods',
  get: ({ get }) => get(filteredModList).filter((mod) => mod.parent),
});

export const installedModList = selector({
  key: 'InstalledMods',
  get: ({ get }) =>
    get(nonAddonModList).filter((mod) => mod.localVersion && !mod.isEnabled),
});

export const enabledModList = selector({
  key: 'EnabledMods',
  get: ({ get }) => get(nonAddonModList).filter((mod) => mod.isEnabled),
});

export const notInstalledModList = selector({
  key: 'NotInstalledMods',
  get: ({ get }) =>
    get(nonAddonModList).filter((mod) => !mod.localVersion && !mod.isRequired),
});

export const requiredModList = selector({
  key: 'RequiredMods',
  get: ({ get }) =>
    get(nonAddonModList).filter(
      (mod) =>
        !mod.localVersion &&
        (mod.isRequired ||
          get(requiredDependencyIdsState).includes(mod.uniqueName))
    ),
});

export const requiredModNamesState = selector({
  key: 'RequiredModNames',
  get: ({ get }) => get(requiredModList).map((mod) => mod.name),
});
