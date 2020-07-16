import React, { useContext, useCallback } from 'react';

import config from '../config.json';
import { setSettings, setOwmlSettings } from '../services';
import { useSettingsFileWatcher } from './use-settings-file-watcher';

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

const owmlDefaultSettings = {};

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const settings = useSettingsFileWatcher<Settings>(
    config.settingsPath,
    config.defaultSettings,
  );
  const owmlSettings = useSettingsFileWatcher<OwmlSettings>(
    config.owmlSettingsPath,
    owmlDefaultSettings,
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
      setOwmlSettings({
        ...owmlSettings,
        ...newSettings,
      });
    },
    [owmlSettings],
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
