import { useEffect } from 'react';
import fs from 'fs-extra';

import config from '../config.json';

type Handler = () => void;

export function useModsDirectoryWatcher(handler: Handler) {
  useEffect(() => {
    const path = `${config.owmlPath}/Mods`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const watcher = fs.watch(path, { recursive: true }, () => {
      handler();
    });

    // Call the handler one first time.
    handler();

    return () => watcher.close();
  }, [handler]);
}
