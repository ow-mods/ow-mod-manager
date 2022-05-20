import { useCallback } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '../hooks';
import {
  remoteModList,
  settingsState,
  modManager as modManagerState,
} from '../store';

export const RemoteModsSubscription: React.FunctionComponent = () => {
  const setRemoteMods = useSetRecoilState(remoteModList);
  const setModManager = useSetRecoilState(modManagerState);
  const { modDatabaseUrl, owmlPath, alphaPath, cmowaPath } = useRecoilValue(settingsState);

  useModsDirectoryWatcher(
    owmlPath,
    alphaPath,
    useCallback(() => {
      const updateMods = async () => {
        const { mods, modManager } = await getModDatabase(
          modDatabaseUrl,
          owmlPath,
          alphaPath,
          cmowaPath
        );
        setRemoteMods(mods);
        setModManager(modManager);
      };
      updateMods();
    }, [modDatabaseUrl, owmlPath, alphaPath, cmowaPath, setRemoteMods, setModManager])
  );

  return null;
};
