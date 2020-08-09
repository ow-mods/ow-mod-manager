import { atom } from 'recoil';

import config from '../config.json';

export const settingsState = atom<Settings>({
  key: 'Settings',
  default: config.defaultSettings,
});

export const owmlSettingsState = atom<OwmlSettings>({
  key: 'OwmlSettings',
  default: {},
});
