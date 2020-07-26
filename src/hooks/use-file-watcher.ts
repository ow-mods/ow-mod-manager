import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import { getSettings } from '../services';

export function useFileWatcher<TFile>(path: string, defaultFile?: TFile) {
  const [file, setFile] = useState<TFile>();

  useEffect(() => {
    const updateFile = () => {
      setFile(getSettings<TFile>(path));
    };
    if (!fs.existsSync(path)) {
      fs.writeJSONSync(path, defaultFile ?? {});
    }
    const watcher = fs.watch(path, () => {
      updateFile();
    });
    updateFile();
    return () => watcher.close();
  }, [path, defaultFile]);

  return file;
}
