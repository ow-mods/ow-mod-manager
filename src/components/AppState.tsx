import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import modDb from '../mod-db.json';

type ContextState = {
  isLocalModsDirty: boolean;
  modMap: ModMap;
  localModMap: ModMap;
};

type ContextMethods = {
  addMod: (mod: Mod) => void;
};

type AppContext = ContextState & ContextMethods;

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  modMap: {},
  localModMap: {},
  addMod: () => {},
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [appState, setState] = useState<ContextState>({
    isLocalModsDirty: true,
    modMap: {},
    localModMap: {},
  });

  const { isLocalModsDirty } = appState;

  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});

  const setAppState = (state: Partial<ContextState>) => {
    setState((prevState) => ({
      ...prevState,
      ...state,
    }));
  };

  const addMod = (mod: Mod) => {
    setState((prevState) => ({
      ...prevState,
      modMap: {
        ...prevState.modMap,
        [mod.uniqueName]: mod,
      },
      isLocalModsDirty: !mod.isLoading,
    }));
  };

  useEffect(() => {
    if (!isLocalModsDirty) {
      return;
    }

    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModMap(localMods);
      setAppState({ isLocalModsDirty: false });
    };

    getMods();
  }, [isLocalModsDirty]);

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModMap((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
    };

    modDb.mods.map(getMod);
  }, []);

  useEffect(() => {
    const mods = merge({}, remoteModMap, localModMap);
    setState((prevState) => ({
      ...prevState,
      modMap: mods,
    }));
  }, [remoteModMap, localModMap]);

  return (
    <AppState.Provider
      value={{
        ...appState,
        localModMap,
        addMod,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
