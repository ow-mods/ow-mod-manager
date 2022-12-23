import { selector, atom } from 'recoil';

import { remoteModList } from './mods-state';

export const modTagsSelectionState = atom<Set<string>>({
  key: 'ModTagsSelection',
  default: new Set(),
});

export const modTagsListState = selector({
  key: 'ModTags',
  get: ({ get }) => {
    const mods = get(remoteModList);
    const tags: Set<string> = new Set<string>();
    const counts: Record<string, number> = {};

    if (!mods) {
      return [];
    }

    mods.forEach((mod) => {
      mod.tags.forEach((tag) => {
        tags.add(tag);
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
    });

    return Array.from(tags).sort(
      (tagA, tagB) => (counts[tagB] ?? 0) - (counts[tagA] ?? 0)
    );
  },
});
