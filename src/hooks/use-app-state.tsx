import React, { useState, useContext, useEffect, useCallback } from 'react';
import { merge } from 'lodash';

import { modsText } from '../static-text';
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
  const {
    settings: { owmlPath },
  } = useSettings();

  const startLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const endLoading = useCallback(() => {
    setLoadingCount((count) => count - 1);
  }, []);

  useModsDirectoryWatcher(
    owmlPath,
    useCallback(() => {
      const getMods = async () => {
        const localModsPromises = await getLocalMods(owmlPath);
        const newModMap: ModMap = {};

        localModsPromises.forEach((result) => {
          if (result.status === 'fulfilled') {
            const mod = result.value;
            newModMap[mod.uniqueName] = mod;
          }
          if (result.status === 'rejected') {
            pushNotification({
              message: `${modsText.localModLoadError}: ${result.reason}`,
              severity: 'error',
            });
          }
        });

        setLocalModMap(newModMap);
      };

      getMods();
    }, [pushNotification, owmlPath]),
  );

  useEffect(() => {
    const getMods = async () => {
      try {
        const { mods, modManager } = await getModDatabase(
          modDatabaseUrl,
          owmlPath,
        );
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
      } catch (error) {
        pushNotification({
          message: `${modsText.databaseLoadError}: ${error}`,
          severity: 'error',
        });
      } finally {
        setLoadingCount((count) => count - 1);
      }
    };

    setLoadingCount((count) => count + 1);
    getMods();
  }, [modDatabaseUrl, pushNotification, owmlPath]);

  useEffect(() => {
    setModMap(merge({}, remoteModMap, localModMap));
  }, [remoteModMap, localModMap]);

  useEffect(() => {
    for (const mod of Object.values(modMap)) {
      if (mod.errors.length > 0) {
        mod.errors.forEach((error) => {
          pushNotification({
            message: `${modsText.localModLoadError}: ${error}`,
            severity: 'error',
          });
        });
      }
    }
  }, [modMap, pushNotification]);

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
