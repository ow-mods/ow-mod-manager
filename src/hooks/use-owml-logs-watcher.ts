import { useEffect } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import useThrottle from './use-throttle';

type Handler = () => void;
const path = `${config.owmlPath}/Logs/OWML.Log.txt`;

function useOwmlLogWatcher(handler: Handler) {
  useEffect(() => {
    const watcher = fs.watch(path, () => {
      const data = fs.readFileSync(path, 'utf8');
      console.log(data);
      handler();
    });

    // Call the handler one first time.
    handler();

    return watcher.close;
  }, []);
}

export default useOwmlLogWatcher;
