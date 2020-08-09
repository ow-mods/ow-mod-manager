import { useCallback } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '../hooks';
import { remoteModList, settingsState } from '../store';

export const RemoteModsSubscription: React.FunctionComponent = () => {
  const setRemoteMods = useSetRecoilState(remoteModList);
  const { modDatabaseUrl, owmlPath } = useRecoilValue(settingsState);

  useModsDirectoryWatcher(
    owmlPath,
    useCallback(() => {
      const updateMods = async () => {
        const { mods } = await getModDatabase(modDatabaseUrl, owmlPath);
        setRemoteMods(mods);
      };
      updateMods();
    }, [modDatabaseUrl, owmlPath, setRemoteMods])
  );

  return null;
};
