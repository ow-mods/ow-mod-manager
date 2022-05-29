import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';
import { getLocalMods } from '../services';
import { useModsDirectoryWatcher, useSettings } from '../hooks';
import { localModList } from '../store';

export const LocalModsSubscription: React.FunctionComponent = () => {
  const setLocalMods = useSetRecoilState(localModList);
  const {
    settings: { owmlPath, alphaPath, owamlPath },
  } = useSettings();

  useModsDirectoryWatcher(
    useCallback(() => {
      setLocalMods(getLocalMods(owmlPath, alphaPath, owamlPath));
    }, [owmlPath, alphaPath, owamlPath, setLocalMods])
  );

  return null;
};
