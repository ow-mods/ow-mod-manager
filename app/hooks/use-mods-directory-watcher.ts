import { useEffect } from 'react';
import fs from 'fs-extra';
import { useLoading } from '../store/loading-state';
import { debugConsole } from '../helpers/console-log';

type Handler = () => void;

export function useModsDirectoryWatcher(
  owmlPath: string,
  alphaPath: string,
  handler: Handler
) {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    debugConsole.log('useEffect: useModsDirectoryWatcher');
    const path = `${owmlPath}/Mods`;
    const patha = `${alphaPath}/BepInEx/plugins`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    if (!fs.existsSync(patha)) {
      fs.mkdirSync(patha, { recursive: true });
    }

    const watcher = fs.watch(
      path,
      { recursive: true },
      (eventType, fileName) => {
        debugConsole.log(
          'useEffect: useModsDirectoryWatcher callback. eventType:',
          eventType,
          'fileName:',
          fileName
        );
        handler();
      }
    );

    const watchera = fs.watch(
      patha,
      { recursive: true },
      (eventType, fileName) => {
        debugConsole.log(
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

    return () => {
      watcher.close();
      watchera.close();
    };
  }, [handler, owmlPath, alphaPath, isLoading]);
}
