import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import ModList from './ModList';

type ContextState = {
  isLocalModsDirty: boolean;
};

type ContextMethods = {
  setIsLocalModsDirty: (isDirty: boolean) => void;
};

type AppContext = ContextState & ContextMethods;

export const Context = React.createContext<AppContext>({
  isLocalModsDirty: true,
  setIsLocalModsDirty: () => {},
});

const App = () => {
  const [context, setContext] = useState<ContextState>({
    isLocalModsDirty: true,
  });

  const setIsLocalModsDirty = (isDirty: boolean) => {
    console.log('setting dirty', isDirty);
    setContext({
      ...context,
      isLocalModsDirty: isDirty,
    });
  };

  return (
    <Context.Provider value={{
      ...context,
      setIsLocalModsDirty,
    }}
    >
      <ModList />
    </Context.Provider>
  );
};

export default hot(App);
