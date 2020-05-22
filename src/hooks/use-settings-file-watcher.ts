import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import { getSettings } from '../services';

export function useSettingsFileWatcher() {
  const [settings, setSettings] = useState<SettingsState>(
    config.defaultSettings,
  );

  const updateSettings = () => {
    setSettings(getSettings());
  };

  useEffect(() => {
    const watcher = fs.watch(config.settingsPath, () => {
      updateSettings();
    });

    updateSettings();

    return watcher.close;
  }, []);

  return settings;
}
