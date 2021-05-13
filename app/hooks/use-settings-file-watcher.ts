import { useEffect, useState } from 'react';
import fs from 'fs-extra';

import { useFileWatcher } from './use-file-watcher';
import { debugConsole } from '../helpers/console-log';

export function useSettingsFileWatcher<
  TSettings extends Record<string, unknown>
>(path: string, defaultSettings?: TSettings) {
  const [settingsResult, setSettingsResult] = useState(
    defaultSettings as TSettings
  );
  const settings = useFileWatcher<TSettings>(path, defaultSettings);

  useEffect(() => {
    if (!path) {
      return;
    }

    debugConsole.log('useEffect: useSettingsFileWatcher defaults check');
    const copyDefaults = () => {
      debugConsole.log('useEffect: useSettingsFileWatcher copyDefaults');
      fs.writeJSONSync(path, {
        ...defaultSettings,
        settings,
      });
    };

    if (settings && defaultSettings) {
      const keys = Object.keys(defaultSettings);
      for (let i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-prototype-builtins
        if (!settings.hasOwnProperty(keys[i])) {
          copyDefaults();
          break;
        }
      }
    }
    if (!fs.existsSync(path) && defaultSettings) {
      copyDefaults();
    }
  }, [defaultSettings, settings, path]);

  useEffect(() => {
    debugConsole.log('useEffect: useSettingsFileWatcher setSettingsResult');
    setSettingsResult({
      ...defaultSettings,
      ...settings,
    } as TSettings);
  }, [settings, defaultSettings]);

  return settingsResult;
}
