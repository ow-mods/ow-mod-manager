import { atom } from 'recoil';

export const selectedTabState = atom({
  key: 'SelectedTab',
  default: 0,
});

export const loadingModsTabState = atom({
  key: 'LoadingModsTab',
  default: true,
});
