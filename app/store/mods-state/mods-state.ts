import { atom, selector } from 'recoil';
import { merge, keyBy } from 'lodash';
import { remote } from 'electron';

import { modsText } from '../../helpers/static-text';
import { settingsState } from '../settings-state';

export const remoteModList = atom<Mod[]>({
  key: 'RemoteModList',
  default: [],
});

export const localModList = atom<Mod[]>({
  key: 'LocalModList',
  default: [],
});

export const modManager = atom<ModManager>({
  key: 'ModManager',
  default: {
    downloadCount: 0,
  },
});

function regularFilter(mod: Mod) {
  return Boolean(!mod.isAlpha);
}

function alphaFilter(mod: Mod) {
  return Boolean(mod.isAlpha);
}

const remoteModMap = selector({
  key: 'RemoteModMap',
  get: ({ get }) => {
    const filter = get(settingsState).alphaMode ? alphaFilter : regularFilter;
    return keyBy(get(remoteModList).filter(filter), 'uniqueName');
  },
});

export const localModMap = selector({
  key: 'LocalModMap',
  get: ({ get }) => {
    const filter = get(settingsState).alphaMode ? alphaFilter : regularFilter;
    return keyBy(get(localModList).filter(filter), 'uniqueName');
  },
});

const modMapState = selector({
  key: 'ModMap',
  get: ({ get }) =>
    merge<ModMap, ModMap, ModMap>({}, get(remoteModMap), get(localModMap)),
});

export const modList = selector({
  key: 'ModList',
  get: ({ get }) => {
    return Object.values(get(modMapState)).concat({
      ...modsText.modManager,
      uniqueName: 'ow-mod-manager',
      isRequired: true,
      isEnabled: true,
      localVersion: remote.app.getVersion(),
      remoteVersion: remote.app.getVersion(),
      repo: 'https://github.com/ow-mods/ow-mod-manager',
      modPath: '.',
      downloadUrl: '',
      downloadCount: get(modManager).downloadCount,
      errors: [],
      dependencies: [],
      addons: [],
      isAlpha: get(settingsState).alphaMode,
    });
  },
});
