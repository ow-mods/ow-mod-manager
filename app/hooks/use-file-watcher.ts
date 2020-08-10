import { useEffect, useState } from 'react';
import path from 'path';
import fs from 'fs-extra';

import { getSettings } from '../services';

export function useFileWatcher<TFile>(filePath: string, defaultFile?: TFile) {
  const [file, setFile] = useState<TFile>();

  useEffect(() => {
    console.log('useEffect: UseFileWatcher');
    const updateFile = async (updateFilePath: string) => {
      console.log('useEffect: UseFileWatcher updateFile');
      setFile(await getSettings<TFile>(updateFilePath));
    };
    const directory = path.dirname(filePath);
    if (!fs.pathExistsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeJSONSync(filePath, defaultFile ?? {});
    }
    const watcher = fs.watch(filePath, () => {
      updateFile(filePath);
    });
    updateFile(filePath);
    return () => watcher.close();
  }, [filePath, defaultFile]);

  return file;
}
