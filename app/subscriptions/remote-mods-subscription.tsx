import { useCallback } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '../hooks';
import { remoteModList, settingsState, modManager } from '../store';

export const RemoteModsSubscription: React.FunctionComponent = () => {
  const setRemoteMods = useSetRecoilState(remoteModList);
  const setModManager = useSetRecoilState(modManager);
  const { modDatabaseUrl, owmlPath } = useRecoilValue(settingsState);

  useModsDirectoryWatcher(
    owmlPath,
    useCallback(() => {
      const updateMods = async () => {
        const { mods, modManager } = await getModDatabase(modDatabaseUrl, owmlPath);
        setRemoteMods(mods);
        setModManager(modManager);
      };
      updateMods();
    }, [modDatabaseUrl, owmlPath, setRemoteMods])
  );

  return null;
};
