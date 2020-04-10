import React, { useState, useContext } from 'react';

type ContextState = {
  isLocalModsDirty: boolean;
  modMap: ModMap;
};

type ContextMethods = {
  setAppState: (state: Partial<ContextState>) => void;
};

type AppContext = ContextState & ContextMethods;

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  modMap: {},
  setAppState: () => {},
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [appState, setState] = useState<ContextState>({
    isLocalModsDirty: true,
    modMap: {},
  });

  const setAppState = (state: Partial<ContextState>) => {
    setState({
      ...appState,
      ...state,
    });
  };

  return (
    <AppState.Provider
      value={{
        ...appState,
        setAppState,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
