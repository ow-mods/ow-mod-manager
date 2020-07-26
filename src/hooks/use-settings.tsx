import React, { useContext, useCallback } from 'react';

import config from '../config.json';
import {
  setSettings,
  setOwmlSettings,
  getOwmlSettingsPath,
  getOwmlDefaultSettingsPath,
} from '../services';
import { useSettingsFileWatcher } from './use-settings-file-watcher';
import { useFileWatcher } from './use-file-watcher';

export type SettingsContext = {
  settings: Settings;
  owmlSettings: OwmlSettings;
  setSettings: (settings: Partial<Settings>) => void;
  setOwmlSettings: (settings: Partial<OwmlSettings>) => void;
};

const Settings = React.createContext<SettingsContext>({
  settings: config.defaultSettings,
  owmlSettings: {},
  setSettings: () => {},
  setOwmlSettings: () => {},
});

export const useSettings = () => useContext(Settings);

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const settings = useSettingsFileWatcher<Settings>(
    config.settingsPath,
    config.defaultSettings,
  );

  const defaultOwmlSettings = useFileWatcher<OwmlSettings>(
    getOwmlDefaultSettingsPath(settings.owmlPath),
  );

  const owmlSettings = useSettingsFileWatcher<OwmlSettings>(
    getOwmlSettingsPath(settings.owmlPath),
    defaultOwmlSettings,
  );

  const setSettingsPartial = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings({
        ...settings,
        ...newSettings,
      });
    },
    [settings],
  );

  const setOwmlSettingsPartial = useCallback(
    (newSettings: Partial<OwmlSettings>) => {
      setOwmlSettings(getOwmlSettingsPath(settings.owmlPath), {
        ...owmlSettings,
        ...newSettings,
      });
    },
    [owmlSettings, settings.owmlPath],
  );

  return (
    <Settings.Provider
      value={{
        settings,
        owmlSettings,
        setSettings: setSettingsPartial,
        setOwmlSettings: setOwmlSettingsPartial,
      }}
    >
      {children}
    </Settings.Provider>
  );
};
