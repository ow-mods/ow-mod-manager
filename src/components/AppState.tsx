import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import getLocalOwml from '../services/get-local-owml';
import modDb from '../mod-db.json';

type ContextState = {
  isLocalModsDirty: boolean;
  modMap: ModMap;
  owml?: Mod;
};

type ContextMethods = {
  addMod: (mod: Mod) => void;
};

type AppContext = ContextState & ContextMethods;

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  modMap: {},
  addMod: () => {},
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [appState, setState] = useState<ContextState>({
    isLocalModsDirty: true,
    modMap: {},
  });

  const { isLocalModsDirty } = appState;

  const [remoteModList, setRemoteModList] = useState<ModMap>({});
  const [localModList, setLocalModList] = useState<ModMap>({});
  const [owml, setOwml] = useState<Mod>();

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

    const getOwml = async () => {
      const localOwml = await getLocalOwml();
      setOwml((prevOwml) => ({
        ...prevOwml,
        ...localOwml,
      }));
    };

    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModList(localMods);
      setAppState({ isLocalModsDirty: false });
    };

    getOwml();
    getMods();
  }, [isLocalModsDirty]);

  useEffect(() => {
    const getOwml = async () => {
      const remoteOwml = await getRemoteMod(modDb.owml);
      setOwml((prevOwml) => ({
        ...prevOwml,
        ...remoteOwml,
      }));
    };

    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModList((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
    };

    getOwml();
    modDb.mods.map(getMod);
  }, []);

  useEffect(() => {
    const mods = merge({}, remoteModList, localModList);
    setState((prevState) => ({
      ...prevState,
      modMap: mods,
      owml,
    }));
  }, [remoteModList, localModList, owml]);

  return (
    <AppState.Provider
      value={{
        ...appState,
        addMod,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
