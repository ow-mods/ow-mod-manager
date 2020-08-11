import { atom, selector } from 'recoil';
import { merge, keyBy } from 'lodash';

export const remoteModList = atom<Mod[]>({
  key: 'RemoteModList',
  default: [],
});

export const localModList = atom<Mod[]>({
  key: 'LocalModList',
  default: [],
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
  get: ({ get }) => Object.values(get(modMapState)),
});

export const isVrModEnabledState = selector({
  key: 'IsVRModEnabled',
  get: ({ get }) =>
    Boolean(get(localModList).find((mod) => mod.isEnabled && mod.requireVR)),
});
