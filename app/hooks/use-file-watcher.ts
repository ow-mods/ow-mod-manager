import { useEffect, useState } from 'react';
import path from 'path';
import fs from 'fs-extra';

import { getSettings } from '../services';
import { debugConsole } from '../helpers/console-log';

export function useFileWatcher<TFile>(filePath: string, defaultFile?: TFile) {
  const [file, setFile] = useState<TFile>();

  useEffect(() => {
    try {
      if (!filePath) {
        return undefined;
      }

      debugConsole.log('useEffect: UseFileWatcher', filePath);
      const updateFile = async (updateFilePath: string) => {
        debugConsole.log('useEffect: UseFileWatcher updateFile');
        setFile(await getSettings<TFile>(updateFilePath));
      };
      const directory = path.dirname(filePath);
      if (!fs.pathExistsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      if (!fs.existsSync(filePath)) {
        debugConsole.log('useFileWatcher: writing defaults');
        fs.writeJSONSync(filePath, defaultFile ?? {});
      }
      const watcher = fs.watch(filePath, () => {
        updateFile(filePath);
      });
      updateFile(filePath);
      return () => watcher.close();
    } catch (error) {
      debugConsole.error('Error in file watcher', error);
      return undefined;
    }
  }, [filePath, defaultFile]);

  return file;
}
