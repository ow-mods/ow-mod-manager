import { selector, atom } from 'recoil';

import { modList } from './mods-state';

export const modTagsSelectionState = atom<string[]>({
  key: 'ModTagsSelection',
  default: [],
});

export const modTagsListState = selector({
  key: 'ModTags',
  get: ({ get }) => {
    const mods = get(modList);
    const tags: Set<string> = new Set(['untagged']);
    const counts: Record<string, number> = {};

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
