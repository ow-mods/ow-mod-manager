import { useEffect, useRef } from 'react';
import fs from 'fs-extra';

import config from '../config.json';

const useModsDirectoryWatcher = (handler: Function) => {
  const savedHandler = useRef<Function>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const watcher = fs.watch(
      `${config.owmlPath}/mods`,
      { recursive: true },
      (eventType, fileName) => {
        console.log(eventType, fileName);
        savedHandler.current();
      },
    );

    savedHandler.current();

    return watcher.close;
  }, []);
};

export default useModsDirectoryWatcher;
