import { useEffect, useRef, useCallback } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import useThrottle from './useThrottle';

type Handler = () => void;

function useModsDirectoryWatcher(handler: Handler) {
  const debouncedHandler = useThrottle(handler);

  useEffect(() => {
    const watcher = fs.watch(
      `${config.owmlPath}/mods`,
      { recursive: true },
      (eventType, fileName) => {
        debouncedHandler();
      },
    );
    debouncedHandler();

    return watcher.close;
  }, []);
}

export default useModsDirectoryWatcher;
