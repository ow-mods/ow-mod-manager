import { atom, selector } from 'recoil';
import { merge, keyBy } from 'lodash';
import { remote } from 'electron';

import { modsText } from '../../helpers/static-text';

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

const remoteModMap = selector({
  key: 'RemoteModMap',
  get: ({ get }) => keyBy(get(remoteModList), 'uniqueName'),
});

export const localModMap = selector({
  key: 'LocalModMap',
  get: ({ get }) => keyBy(get(localModList), 'uniqueName'),
});

const modMapState = selector({
  key: 'ModMap',
  get: ({ get }) =>
    merge<ModMap, ModMap, ModMap>({}, get(remoteModMap), get(localModMap)),
});

export const modList = selector({
  key: 'ModList',
  get: ({ get }) =>
    Object.values(get(modMapState)).concat({
      ...modsText.modManager,
      uniqueName: 'ow-mod-manager',
      isRequired: true,
      isEnabled: true,
      localVersion: remote.app.getVersion(),
      remoteVersion: remote.app.getVersion(),
      repo: 'https://github.com/Raicuparta/ow-mod-manager',
      modPath: '.',
      downloadUrl: '',
      downloadCount: get(modManager).downloadCount,
      errors: [],
      dependencies: [],
      addons: [],
    }),
});
