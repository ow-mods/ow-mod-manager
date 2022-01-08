import { atom } from 'recoil';

export const selectedTabState = atom({
  key: 'SelectedTab',
  default: 0,
});
