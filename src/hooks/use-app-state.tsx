import React, { useState, useContext, useEffect } from 'react';
import { merge } from 'lodash';

import modDb from '../mod-db.json';
import { getLocalMods, getRemoteMod, getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '.';

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

  useModsDirectoryWatcher(() => {
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModMap(localMods);
    };

    getMods();
  });

  useEffect(() => {
    const getMods = async () => {
      setLoadingCount((count) => count + 1);
      const modDatabase = await getModDatabase();
      setRemoteModMap(
        modDatabase.reduce(
          (accumulator, mod) => ({
            ...accumulator,
            [mod.manifest.uniqueName]: {
              name: mod.manifest.name,
              author: mod.manifest.author,
              uniqueName: mod.manifest.uniqueName,
              modPath: 'string',
              remoteVersion: mod.manifest.version,
              downloadUrl: mod.downloadUrl,
              downloadCount: mod.downloadCount,
              //repo?: string, // TODO missing repo
              isLoading: false,
            },
          }),
          {},
        ),
      );
    };

    getMods();
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
