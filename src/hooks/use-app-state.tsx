import React, { useState, useContext, useEffect, useCallback } from 'react';
import { merge } from 'lodash';

import { getLocalMods, getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '.';
import { useSettings } from './use-settings';

type AppContext = {
  modMap: ModMap;
  loadingCount: number;
  startLoading: () => void;
  endLoading: () => void;
};

const AppState = React.createContext<AppContext>({
  modMap: {},
  startLoading: () => {},
  endLoading: () => {},
  loadingCount: 0,
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});
  const [modMap, setModMap] = useState<ModMap>({});
  const [loadingCount, setLoadingCount] = useState(0);
  const {
    settings: { modDatabaseUrl },
  } = useSettings();

  const startLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const endLoading = useCallback(() => {
    setLoadingCount((count) => count - 1);
  }, []);

  useModsDirectoryWatcher(() => {
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModMap(localMods);
    };

    getMods();
  });

  useEffect(() => {
    const getMods = async () => {
      try {
        const modDatabase = await getModDatabase(modDatabaseUrl);
        setRemoteModMap(
          modDatabase.reduce(
            (accumulator, mod) => ({
              ...accumulator,
              [mod.uniqueName]: mod,
            }),
            {},
          ),
        );
      } finally {
        setLoadingCount((count) => count - 1);
      }
    };

    setLoadingCount((count) => count + 1);
    getMods();
  }, [modDatabaseUrl]);

  useEffect(() => {
    setModMap(merge({}, remoteModMap, localModMap));
  }, [remoteModMap, localModMap]);

  return (
    <AppState.Provider
      value={{
        modMap,
        startLoading,
        endLoading,
        loadingCount,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
