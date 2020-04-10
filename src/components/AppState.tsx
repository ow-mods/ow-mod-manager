import React, { useState } from 'react';

type ContextState = {
  isLocalModsDirty: boolean;
};

type ContextMethods = {
  setAppState: (state: Partial<ContextState>) => void;
};

type AppContext = ContextState & ContextMethods;

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  setAppState: () => {},
});

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [appState, setState] = useState<ContextState>({
    isLocalModsDirty: true,
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

export default AppState;
