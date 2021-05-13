import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';

import {
  settingsState,
  owmlSettingsState,
  defaultOwmlSettingsState,
} from '../store';
import {
  getOwmlDefaultSettingsPath,
  getOwmlSettingsPath,
  getSettingsPath,
  defaultAppSettings,
} from '../services';
import { useFileWatcher, useSettingsFileWatcher } from '../hooks';
import { debugConsole } from '../helpers/console-log';

export const SettingsSubscription: React.FunctionComponent = () => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const setOwmlSettings = useSetRecoilState(owmlSettingsState);
  const setDefaultOwmlSettings = useSetRecoilState(defaultOwmlSettingsState);

  const settingsFile = useSettingsFileWatcher<Settings>(
    getSettingsPath(),
    defaultAppSettings
  );

  // TODO: this should be only in global state, not here.
  const defaultOwmlSettings = useFileWatcher<OwmlSettings>(
    getOwmlDefaultSettingsPath(settingsFile.owmlPath)
  );

  const owmlSettingsFile = useSettingsFileWatcher<OwmlSettings>(
    getOwmlSettingsPath(settings.owmlPath),
    defaultOwmlSettings
  );

  useEffect(() => {
    debugConsole.log('useEffect: SettingsSubscription setOwmlSettings');
    setOwmlSettings(owmlSettingsFile);
  }, [owmlSettingsFile, setOwmlSettings]);

  useEffect(() => {
    debugConsole.log('useEffect: SettingsSubscription setSettings');
    setSettings(settingsFile);
  }, [settingsFile, setSettings]);

  useEffect(() => {
    debugConsole.log('ueEffect: set defaultOwmlSettingsState');
    if (defaultOwmlSettings) {
      setDefaultOwmlSettings(defaultOwmlSettings);
    }
  }, [defaultOwmlSettings, setDefaultOwmlSettings]);

  return null;
};
