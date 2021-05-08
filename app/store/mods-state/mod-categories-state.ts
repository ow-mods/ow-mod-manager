import { selector } from 'recoil';
import { remote } from 'electron';
import packageJson from '../../../package.json';

import { filteredModList } from './mod-filter-state';
import { requiredDependencyIdsState } from './mod-dependencies-state';

export const installedModList = selector({
  key: 'InstalledMods',
  get: ({ get }) => get(filteredModList).filter((mod) => mod.localVersion).concat({
    name: 'Outer Wilds Mod Manager',
    author: 'Raicuparta & Alek',
    uniqueName: 'ow-mod-manager',
    isRequired: true,
    isEnabled: true,
    localVersion: remote.app.getVersion(),
    remoteVersion: remote.app.getVersion(),
    repo: packageJson.repository.url,
    modPath: '.',
    downloadUrl: '',
    errors: [],
    dependencies: [],
  }),
});

export const notInstalledModList = selector({
  key: 'NotInstalledMods',
  get: ({ get }) =>
    get(filteredModList).filter((mod) => !mod.localVersion && !mod.isRequired),
});

export const requiredModList = selector({
  key: 'RequiredMods',
  get: ({ get }) =>
    get(filteredModList).filter(
      (mod) =>
        !mod.localVersion &&
        (mod.isRequired ||
          get(requiredDependencyIdsState).includes(mod.uniqueName))
    ),
});

export const requiredModNamesState = selector({
  key: 'RequiredModNames',
  get: ({ get }) => get(requiredModList).map((mod) => mod.name),
});
