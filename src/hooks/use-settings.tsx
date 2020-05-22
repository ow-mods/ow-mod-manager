import React, { useCallback, useContext } from 'react';

import { setSettings } from '../services';
import { useSettingsFileWatcher } from './use-settings-file-watcher';

export type SettingsContext = {
  settings: SettingsState;
  setSettings: (settings: Partial<SettingsState>) => void;
};

const defaultSettings: SettingsState = {
  closeOnPlay: false,
  logToSocket: true,
};

const Settings = React.createContext<SettingsContext>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const useSettings = () => useContext(Settings);

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const settings = useSettingsFileWatcher();

  const setSettingsPartial = useCallback(
    (newSettings: Partial<SettingsState>) => {
      setSettings({
        ...settings,
        ...newSettings,
      });
    },
    [],
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
