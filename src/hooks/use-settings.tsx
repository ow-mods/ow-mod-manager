import React, { useState, useCallback, useContext } from 'react';

type SettingsState = {
  closeOnPlay: boolean;
  logToSocket: boolean;
};

type SettingsContext = {
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
  const [settings, setSettings] = useState(defaultSettings);

  const setSettingsPartial = useCallback(
    (newSettings: Partial<SettingsState>) => {
      setSettings((previousSettings) => ({
        ...previousSettings,
        ...newSettings,
      }));
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
