import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';
import { getLocalModsSync } from '../services';
import { useModsDirectoryWatcher, useSettings } from '../hooks';
import { localModList } from '../store';

export const LocalModsSubscription: React.FunctionComponent = () => {
  const setLocalMods = useSetRecoilState(localModList);
  const {
    settings: { owmlPath },
  } = useSettings();

  useModsDirectoryWatcher(
    owmlPath,
    useCallback(() => {
      setLocalMods(getLocalModsSync(owmlPath));
    }, [owmlPath, setLocalMods])
  );

  return null;
};
