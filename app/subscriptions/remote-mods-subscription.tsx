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
  const { modDatabaseUrl, owmlPath } = useRecoilValue(settingsState);

  useModsDirectoryWatcher(
    owmlPath,
    useCallback(() => {
      const updateMods = async () => {
        const { mods, modManager } = await getModDatabase(
          modDatabaseUrl,
          owmlPath
        );
        setRemoteMods(mods);
        setModManager(modManager);
      };
      updateMods();
    }, [modDatabaseUrl, owmlPath, setRemoteMods, setModManager])
  );

  return null;
};
