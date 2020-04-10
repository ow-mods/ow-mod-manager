import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import modDB from '../mod-db.json';

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

  const {
    isLocalModsDirty,
  } = appState;

  const [remoteModList, setRemoteModList] = useState<ModMap>({});
  const [localModList, setLocalModList] = useState<ModMap>({});


  const setAppState = (state: Partial<ContextState>) => {
    setState({
      ...appState,
      ...state,
    });
  };

  useEffect(() => {
    if (!isLocalModsDirty) {
      return;
    }
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModList(localMods);
      setAppState({ isLocalModsDirty: false });
    };
    getMods();
  }, [isLocalModsDirty]);

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModList((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
    };
    modDB.map(getMod);
  }, []);

  useEffect(() => {
    const mods = merge({}, remoteModList, localModList);
    setAppState({
      isLocalModsDirty,
      modMap: mods,
    });
  }, [remoteModList, localModList]);

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
