import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';

import config from '../config.json';
import { settingsState, owmlSettingsState } from '../store';
import { getOwmlDefaultSettingsPath, getOwmlSettingsPath } from '../services';
import { useFileWatcher, useSettingsFileWatcher } from '../hooks';

export const SettingsSubscription: React.FunctionComponent = () => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const setOwmlSettings = useSetRecoilState(owmlSettingsState);

  const settingsFile = useSettingsFileWatcher<Settings>(
    config.settingsPath,
    config.defaultSettings
  );

  const defaultOwmlSettings = useFileWatcher<OwmlSettings>(
    getOwmlDefaultSettingsPath(settingsFile.owmlPath)
  );

  const owmlSettingsFile = useSettingsFileWatcher<OwmlSettings>(
    getOwmlSettingsPath(settings.owmlPath),
    defaultOwmlSettings
  );

  useEffect(() => {
    console.log('useEffect: SettingsSubscription setOwmlSettings');
    setOwmlSettings(owmlSettingsFile);
  }, [owmlSettingsFile, setOwmlSettings]);

  useEffect(() => {
    console.log('useEffect: SettingsSubscription setSettings');
    setSettings(settingsFile);
  }, [settingsFile, setSettings]);

  return null;
};
