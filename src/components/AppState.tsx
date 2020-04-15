import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import modDb from '../mod-db.json';
import useModsWatcher from '../hooks/use-mods-watcher';
import useOwmlLogWatcher from '../hooks/use-owml-logs-watcher';

type AppContext = {
  modMap: ModMap;
  loadingCount: number;
  setModIsLoading: (uniqueName: string, isLoading: boolean) => void;
};

const AppState = React.createContext<AppContext>({
  modMap: {},
  setModIsLoading: () => {},
  loadingCount: 0,
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});
  const [modMap, setModMap] = useState<ModMap>({});
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
  };

  useModsWatcher(() => {
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModMap(localMods);
    };

    getMods();
  });

  useOwmlLogWatcher(() => {});

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      setLoadingCount((count) => {
        return count + 1;
      });
      getRemoteMod(modDbItem)
        .then((remoteMod) => {
          setRemoteModMap((remoteMods) => ({
            ...remoteMods,
            [remoteMod.uniqueName]: remoteMod,
          }));
        })
        .finally(() => {
          setLoadingCount((count) => {
            return count - 1;
          });
        });
    };

    modDb.mods.forEach(getMod);
  }, []);

  useEffect(() => {
    setModMap(merge({}, remoteModMap, localModMap));
  }, [remoteModMap, localModMap]);

  return (
    <AppState.Provider
      value={{
        modMap,
        setModIsLoading,
        loadingCount,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
