import { useEffect } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import { useThrottle } from './use-throttle';

type Handler = () => void;

export function useModsWatcher(handler: Handler) {
  // Throttle handler to prevent it being called too often.
  const debouncedHandler = useThrottle(handler);

  useEffect(() => {
    const watcher = fs.watch(
      `${config.owmlPath}/Mods`,
      { recursive: true },
      () => {
        debouncedHandler();
      },
    );

    // Call the handler one first time.
    handler();

    return watcher.close;
  }, []);
}
