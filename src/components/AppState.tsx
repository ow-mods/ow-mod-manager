import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import modDb from '../mod-db.json';

type AppContext = {
  modMap: ModMap;
  isLocalModsDirty: boolean;
  loadingCount: number;
  addMod: (mod: Mod) => void;
};

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  modMap: {},
  addMod: () => {},
  loadingCount: 0,
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});
  const [modMap, setModMap] = useState<ModMap>({});
  const [isLocalModsDirty, setIsLocalModsDirty] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const addMod = (mod: Mod) => {
    setModMap((prevState) => ({
      ...prevState,
      [mod.uniqueName]: mod,
    }));
    setIsLocalModsDirty(true);
  };

  useEffect(() => {
    if (!isLocalModsDirty) {
      return;
    }

    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModMap(localMods);
      setIsLocalModsDirty(false);
    };

    getMods();
  }, [isLocalModsDirty]);

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      setLoadingCount((count) => {
        console.log('inc', count);
        return count + 1;
      });
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModMap((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
      setLoadingCount((count) => {
        console.log('dec', count);
        return count - 1;
      });
    };

    modDb.mods.forEach(getMod);
  }, []);

  useEffect(() => {
    const mods = merge({}, remoteModMap, localModMap);
    setModMap(mods);
  }, [remoteModMap, localModMap]);

  console.log('count this', loadingCount);
  return (
    <AppState.Provider
      value={{
        modMap,
        isLocalModsDirty,
        addMod,
        loadingCount,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
