import React, { useState } from 'react';

type ContextState = {
  isLocalModsDirty: boolean;
};

type ContextMethods = {
  setIsLocalModsDirty: (isDirty: boolean) => void;
};

type AppContext = ContextState & ContextMethods;

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  setIsLocalModsDirty: () => {},
});

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [context, setContext] = useState<ContextState>({
    isLocalModsDirty: true,
  });

  const setIsLocalModsDirty = (isDirty: boolean) => {
    setContext({
      ...context,
      isLocalModsDirty: isDirty,
    });
  };

  return (
    <AppState.Provider
      value={{
        ...context,
        setIsLocalModsDirty,
      }}
    >
      {children}
    </AppState.Provider>
  );
};

export default AppState;
