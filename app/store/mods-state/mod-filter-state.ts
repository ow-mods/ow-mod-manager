import { atom, selector } from 'recoil';

import { modList } from './mods-state';
import { missingDependencyIdsState } from './mod-dependencies-state';

const filterByText = (filter: string, mod: Mod, mods: Mod[]): boolean => {
  const lowerCaseFilter = filter.toLowerCase();
  const nameMatch = mod.name?.toLowerCase().includes(lowerCaseFilter);
  const authorNatch = mod.author?.toLowerCase().includes(lowerCaseFilter);
  const authorDisplayMatch = mod.authorDisplay
    ?.toLowerCase()
    .includes(lowerCaseFilter);
  const uniqueNameMatch = mod.uniqueName
    ?.toLowerCase()
    .includes(lowerCaseFilter);
  const descriptionMatch = mod.description
    ?.toLowerCase()
    .includes(lowerCaseFilter);

  const addonMatch =
    mod.addons.find((addonUniqueName) => {
      const addon = mods.find(
        (modFromList) => modFromList.uniqueName === addonUniqueName
      );

      if (!addon) return false;

      return filterByText(filter, addon, mods);
    }) !== undefined;

  return (
    nameMatch ||
    authorNatch ||
    authorDisplayMatch ||
    uniqueNameMatch ||
    descriptionMatch ||
    addonMatch
  );
};

export const modFilterState = atom({
  key: 'ModFilter',
  default: '',
});

export const filteredModList = selector({
  key: 'FilteredModList',
  get: ({ get }) => {
    const filter = get(modFilterState);
    const mods = get(modList);
    const dependencyErrors = get(missingDependencyIdsState);
    return mods
      .filter((mod) => {
        return dependencyErrors.includes(mod.uniqueName) || filterByText(filter, mod, mods);
      })
      .sort(
        (modA, modB) => (modB.downloadCount ?? 0) - (modA.downloadCount ?? 0)
      );
  },
});

export const isFiltering = selector({
  key: 'IsFiltering',
  get: ({ get }) => Boolean(get(modFilterState)),
});
