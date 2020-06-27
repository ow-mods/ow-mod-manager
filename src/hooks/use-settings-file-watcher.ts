import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import { getSettings } from '../services';

// TODO: no any
export function useSettingsFileWatcher(path: string, defaultSettings: any) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const updateSettings = () => {
      setSettings({
        ...defaultSettings,
        ...getSettings(),
      });
    };

    if (!fs.existsSync(path)) {
      fs.writeJSONSync(path, defaultSettings);
    }

    const watcher = fs.watch(path, () => {
      updateSettings();
    });

    updateSettings();

    return () => watcher.close();
  }, [defaultSettings, path]);

  return settings;
}
