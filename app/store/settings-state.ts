import { atom } from 'recoil';

import { getDefaultAppSettings } from '../services';

export const settingsState = atom<Settings>({
  key: 'Settings',
  default: getDefaultAppSettings(),
});

export const owmlSettingsState = atom<OwmlSettings>({
  key: 'OwmlSettings',
  default: {},
});

export const defaultOwmlSettingsState = atom<OwmlSettings>({
  key: 'DefaultOwmlSettings',
  default: {},
});
