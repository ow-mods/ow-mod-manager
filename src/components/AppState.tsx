import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import modDb from '../mod-db.json';

type AppContext = {
  modMap: ModMap;
  isLocalModsDirty: boolean;
  loadingCount: number;
  setModIsLoading: (uniqueName: string, isLoading: boolean) => void;
};

const AppState = React.createContext<AppContext>({
  isLocalModsDirty: true,
  modMap: {},
  setModIsLoading: () => {},
  loadingCount: 0,
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});
  const [modMap, setModMap] = useState<ModMap>({});
  const [isLocalModsDirty, setIsLocalModsDirty] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const setModIsLoading = (uniqueName: string, isLoading: boolean) => {
    setModMap((prevState) => {
      return {
        ...prevState,
        [uniqueName]: {
          ...prevState[uniqueName],
          isLoading,
        },
      };
    });
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
        return count + 1;
      });
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModMap((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
      setLoadingCount((count) => {
        return count - 1;
      });
    };

    modDb.mods.forEach(getMod);
  }, []);

  useEffect(() => {
    const mods = merge({}, remoteModMap, localModMap);
    setModMap(mods);
  }, [remoteModMap, localModMap]);

  return (
    <AppState.Provider
      value={{
        modMap,
        isLocalModsDirty,
        setModIsLoading,
        loadingCount,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
