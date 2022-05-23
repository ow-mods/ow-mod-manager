import { selector } from 'recoil';

import { filteredModList, filteredAlphaModList } from './mod-filter-state';
import { requiredDependencyIdsState } from './mod-dependencies-state';

export const nonAddonModList = selector({
  key: 'NonAddonMods',
  get: ({ get }) => get(filteredModList).filter((mod) => !mod.parent),
});

export const nonAddonAlphaModList = selector({
  key: 'NonAddonAlphaMods',
  get: ({ get }) => get(filteredAlphaModList).filter((mod) => !mod.parent),
});

export const addonModList = selector({
  key: 'AddonMods',
  get: ({ get }) =>
    get(filteredModList).filter((mod) => mod.parent && !mod.localVersion),
});

export const addonAlphaModList = selector({
  key: 'AddonAlphaMods',
  get: ({ get }) =>
    get(filteredAlphaModList).filter((mod) => mod.parent && !mod.localVersion),
});

export const installedModList = selector({
  key: 'InstalledMods',
  get: ({ get }) =>
    get(filteredModList).filter((mod) => mod.localVersion && !mod.isEnabled),
});

export const installedAlphaModList = selector({
  key: 'InstalledAlphaMods',
  get: ({ get }) =>
    get(filteredAlphaModList).filter(
      (mod) => mod.localVersion && !mod.isEnabled
    ),
});

export const enabledModList = selector({
  key: 'EnabledMods',
  get: ({ get }) =>
    get(filteredModList).filter((mod) => mod.localVersion && mod.isEnabled),
});

export const enabledAlphaModList = selector({
  key: 'EnabledAlphaMods',
  get: ({ get }) =>
    get(filteredAlphaModList).filter(
      (mod) => mod.localVersion && mod.isEnabled
    ),
});

export const notInstalledModList = selector({
  key: 'NotInstalledMods',
  get: ({ get }) =>
    get(nonAddonModList).filter((mod) => !mod.localVersion && !mod.isRequired),
});

export const notInstalledAlphaModList = selector({
  key: 'NotInstalledAlphaMods',
  get: ({ get }) =>
    get(nonAddonAlphaModList).filter(
      (mod) => !mod.localVersion && !mod.isRequired
    ),
});

export const requiredModList = selector({
  key: 'RequiredMods',
  get: ({ get }) =>
    get(nonAddonModList).filter(
      (mod) =>
        (!mod.localVersion || !mod.isEnabled) &&
        (mod.isRequired ||
          get(requiredDependencyIdsState).includes(mod.uniqueName))
    ),
});

export const requiredAlphaModList = selector({
  key: 'RequiredAlphaMods',
  get: ({ get }) =>
    get(nonAddonAlphaModList).filter(
      (mod) =>
        (!mod.localVersion || !mod.isEnabled) &&
        (mod.isRequired ||
          get(requiredDependencyIdsState).includes(mod.uniqueName))
    ),
});

export const requiredModNamesState = selector({
  key: 'RequiredModNames',
  get: ({ get }) => get(requiredModList).map((mod) => mod.name),
});

export const requiredAlphaModNamesState = selector({
  key: 'RequiredAlphaModNames',
  get: ({ get }) => get(requiredAlphaModList).map((mod) => mod.name),
});
