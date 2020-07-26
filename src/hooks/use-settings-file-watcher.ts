import { useEffect } from 'react';
import fs from 'fs-extra';

import { useFileWatcher } from './use-file-watcher';

export function useSettingsFileWatcher<
  TSettings extends Record<string, unknown>
>(path: string, defaultSettings?: TSettings) {
  const settings = useFileWatcher<TSettings>(path, defaultSettings);

  useEffect(() => {
    const copyDefaults = () => {
      fs.writeJSONSync(path, {
        ...defaultSettings,
        settings,
      });
    };

    if (settings && defaultSettings) {
      for (const key of Object.keys(defaultSettings)) {
        if (!settings.hasOwnProperty(key)) {
          copyDefaults();
          break;
        }
      }
    }
    if (!fs.existsSync(path) && defaultSettings) {
      copyDefaults;
    }
  }, [defaultSettings, settings, path]);

  return {
    ...defaultSettings,
    ...settings,
  } as TSettings;
}
