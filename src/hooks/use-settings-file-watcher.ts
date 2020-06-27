import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import { getSettings } from '../services';

// TODO: no any
export function useSettingsFileWatcher<TSettings>(
  path: string,
  defaultSettings: TSettings,
) {
  const [settings, setSettings] = useState<TSettings>(defaultSettings);

  useEffect(() => {
    const updateSettings = () => {
      setSettings({
        ...defaultSettings,
        ...getSettings<TSettings>(path),
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
