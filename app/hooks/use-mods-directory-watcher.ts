import { useEffect } from 'react';
import fs from 'fs-extra';
import { useLoading } from '../store/loading-state';

type Handler = () => void;

export function useModsDirectoryWatcher(owmlPath: string, handler: Handler) {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    console.log('useEffect: useModsDirectoryWatcher');
    const path = `${owmlPath}/Mods`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const watcher = fs.watch(
      path,
      { recursive: true },
      (eventType, fileName) => {
        console.log(
          'useEffect: useModsDirectoryWatcher callback. eventType:',
          eventType,
          'fileName:',
          fileName
        );
        handler();
      }
    );

    // Call the handler one first time.
    handler();

    return () => watcher.close();
  }, [handler, owmlPath, isLoading]);
}
