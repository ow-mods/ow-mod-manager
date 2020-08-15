import { atom } from 'recoil';

import { defaultAppSettings } from '../services';

export const settingsState = atom<Settings>({
  key: 'Settings',
  default: defaultAppSettings,
});

export const owmlSettingsState = atom<OwmlSettings>({
  key: 'OwmlSettings',
  default: {},
});

export const defaultOwmlSettingsState = atom<OwmlSettings>({
  key: 'DefaultOwmlSettings',
  default: {},
});
