import { useCallback } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '../hooks';
import {
  remoteModList,
  settingsState,
  modManager as modManagerState,
  loadingModsTabState,
} from '../store';

export const RemoteModsSubscription: React.FunctionComponent = () => {
  const setRemoteMods = useSetRecoilState(remoteModList);
  const setModManager = useSetRecoilState(modManagerState);
  const setLoadingModsTab = useSetRecoilState(loadingModsTabState);
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
        // setLoadingModsTab(false);
        const timeout = setTimeout(() => {
          setLoadingModsTab(false);
        }, 1000);

        return () => clearTimeout(timeout);
      };
      updateMods();
    }, [
      modDatabaseUrl,
      owmlPath,
      setRemoteMods,
      setModManager,
      setLoadingModsTab,
    ])
  );

  return null;
};
