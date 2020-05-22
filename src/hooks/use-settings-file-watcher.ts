import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import defaultSettings from '../../settings.json';
import { getSettings } from '../services';

export function useSettingsFileWatcher() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    const watcher = fs.watch(config.settingsPath, () => {
      setSettings(getSettings());
    });

    return watcher.close;
  }, []);

  return settings;
}
