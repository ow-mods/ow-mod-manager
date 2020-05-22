import React, { useCallback, useContext } from 'react';

import config from '../config.json';
import { setSettings } from '../services';
import { useSettingsFileWatcher } from './use-settings-file-watcher';

export type SettingsContext = {
  settings: SettingsState;
  setSettings: (settings: Partial<SettingsState>) => void;
};

const Settings = React.createContext<SettingsContext>({
  settings: config.defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => useContext(Settings);

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const settings = useSettingsFileWatcher();

  const setSettingsPartial = (newSettings: Partial<SettingsState>) => {
    setSettings({
      ...settings,
      ...newSettings,
    });
  };

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
