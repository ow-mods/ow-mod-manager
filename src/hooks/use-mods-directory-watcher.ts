import { useEffect } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import { useThrottle } from './use-throttle';

type Handler = () => void;

export function useModsDirectoryWatcher(handler: Handler) {
  // Throttle handler to prevent it being called too often.
  const debouncedHandler = useThrottle(handler);

  useEffect(() => {
    const path = `${config.owmlPath}/Mods`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const watcher = fs.watch(path, { recursive: true }, () => {
      debouncedHandler();
    });

    // Call the handler one first time.
    handler();

    return watcher.close;
  }, []);
}
