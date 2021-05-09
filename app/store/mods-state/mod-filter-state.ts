import { atom, selector } from 'recoil';

import { modList } from './mods-state';

const filterByText = (filter: string, mod: Mod) => {
  const lowerCaseFilter = filter.toLowerCase();
  const nameMatch = mod.name.toLowerCase().includes(lowerCaseFilter);
  const authorNatch = mod.author.toLowerCase().includes(lowerCaseFilter);
  const uniqueNameMatch = mod.uniqueName
    .toLowerCase()
    .includes(lowerCaseFilter);
  const descriptionMatch = mod.description
    ?.toLowerCase()
    .includes(lowerCaseFilter);

  return nameMatch || authorNatch || uniqueNameMatch || descriptionMatch;
};

export const modFilterState = atom({
  key: 'ModFilter',
  default: '',
});

export const filteredModList = selector({
  key: 'FilteredModList',
  get: ({ get }) => {
    const filter = get(modFilterState);
    return get(modList)
      .filter((mod) => {
        return filterByText(filter, mod);
      })
      .sort(
        (modA, modB) => (modB.downloadCount ?? 0) - (modA.downloadCount ?? 0)
      );
  },
});
