import { useEffect } from 'react';
import fs from 'fs-extra';

type Handler = () => void;

export function useModsDirectoryWatcher(owmlPath: string, handler: Handler) {
  useEffect(() => {
    const path = `${owmlPath}/Mods`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const watcher = fs.watch(path, { recursive: true }, () => {
      handler();
    });

    // Call the handler one first time.
    handler();

    return () => watcher.close();
  }, [handler, owmlPath]);
}
