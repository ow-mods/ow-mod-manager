import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import config from '../config.json';
import { getSettings } from '../services';

export function useSettingsFileWatcher() {
  const [settings, setSettings] = useState<SettingsState>(
    config.defaultSettings,
  );

  const updateSettings = () => {
    setSettings({
      ...config.defaultSettings,
      ...getSettings(),
    });
  };

  useEffect(() => {
    if (!fs.existsSync(config.settingsPath)) {
      fs.writeJSONSync(config.settingsPath, config.defaultSettings);
    }

    const watcher = fs.watch(config.settingsPath, () => {
      updateSettings();
    });

    updateSettings();

    return watcher.close;
  }, []);

  return settings;
}
