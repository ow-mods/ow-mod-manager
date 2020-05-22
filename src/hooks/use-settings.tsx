import React, { useState, useCallback, useContext } from 'react';

type SettingsState = {
  closeOnPlay: boolean;
};

interface SettingsContext extends SettingsState {
  setSettings: (settings: SettingsState) => void;
}

const defaultState: SettingsState = {
  closeOnPlay: false,
};

const Settings = React.createContext<SettingsContext>({
  ...defaultState,
  setSettings: () => {},
});

export const useSettings = () => useContext(Settings);

export const SettingsProvider: React.FunctionComponent = ({ children }) => {
  const [settings, setSettings] = useState(defaultState);

  const setSettingsPartial = useCallback(
    (newSettings: Partial<SettingsContext>) => {
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
        ...settings,
        setSettings: setSettingsPartial,
      }}
    >
      {children}
    </Settings.Provider>
  );
};
