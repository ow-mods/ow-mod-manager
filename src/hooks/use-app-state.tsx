import React, { useState, useContext, useEffect, useCallback } from 'react';
import { merge } from 'lodash';

import { getLocalMods, getModDatabase } from '../services';
import { useModsDirectoryWatcher } from '.';
import { useSettings } from './use-settings';
import { useNotifications } from './use-notifications';

type AppContext = {
  modMap: ModMap;
  loadingCount: number;
  startLoading: () => void;
  endLoading: () => void;
  appRelease?: AppRelease;
};

const AppState = React.createContext<AppContext>({
  modMap: {},
  startLoading: () => {},
  endLoading: () => {},
  loadingCount: 0,
});

export const useAppState = () => useContext(AppState);

export const AppStateProvider: React.FunctionComponent = ({ children }) => {
  const {
    settings: { modDatabaseUrl },
  } = useSettings();
  const [remoteModMap, setRemoteModMap] = useState<ModMap>({});
  const [localModMap, setLocalModMap] = useState<ModMap>({});
  const [modMap, setModMap] = useState<ModMap>({});
  const [loadingCount, setLoadingCount] = useState(0);
  const [appRelease, setAppRelease] = useState<AppRelease>();
  const { pushNotification } = useNotifications();

  const startLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const endLoading = useCallback(() => {
    setLoadingCount((count) => count - 1);
  }, []);

  useModsDirectoryWatcher(
    useCallback(() => {
      const getMods = async () => {
        const localModsPromises = await getLocalMods();

        localModsPromises.forEach((result) => {
          if (result.status === 'fulfilled') {
            const mod = result.value;

            setLocalModMap((map) => ({
              ...map,
              [mod.uniqueName]: mod,
            }));
            return;
          }
          if (result.status === 'rejected') {
            pushNotification({
              message: `Error loading local mod. Error: ${result.reason}`,
              severity: 'error',
            });
          }
        });
      };

      getMods();
    }, []),
  );

  useEffect(() => {
    const getMods = async () => {
      try {
        const { mods, modManager } = await getModDatabase(modDatabaseUrl);
        setRemoteModMap(
          mods.reduce(
            (accumulator, mod) => ({
              ...accumulator,
              [mod.uniqueName]: mod,
            }),
            {},
          ),
        );
        setAppRelease(modManager);
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
        appRelease,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
