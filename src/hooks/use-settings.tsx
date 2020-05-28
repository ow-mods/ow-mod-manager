import React, { useContext, useCallback } from 'react';

import config from '../config.json';
import { setSettings } from '../services';
import { useSettingsFileWatcher } from './use-settings-file-watcher';

export type SettingsContext = {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
};

const Settings = React.createContext<SettingsContext>({
  settings: config.defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => useContext(Settings);

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const settings = useSettingsFileWatcher();

  const setSettingsPartial = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings({
        ...settings,
        ...newSettings,
      });
    },
    [settings],
  );

  return (
    <Settings.Provider
      value={{
        settings,
        setSettings: setSettingsPartial,
      }}
    >
      {children}
    </Settings.Provider>
  );
};
