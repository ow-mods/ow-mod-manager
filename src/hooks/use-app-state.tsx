import React, { useState, useContext, useEffect, useCallback } from 'react';
import { merge } from 'lodash';

import {
  getLocalManifestPaths,
  getLocalMod,
  getModDatabase,
} from '../services';
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
        try {
          const manifestPaths = await getLocalManifestPaths();
          const newModMap: ModMap = {};

          for (const path of manifestPaths) {
            try {
              const mod = await getLocalMod(path);
              newModMap[mod.uniqueName] = mod;
            } catch (error) {
              pushNotification({
                message: `Failed to load local mod: ${error}`,
                severity: 'error',
              });
            }
          }

          setLocalModMap(newModMap);
        } catch (error) {
          pushNotification({
            message: `Failed to find local mods: ${error}`,
            severity: 'error',
          });
        }
      };

      getMods();
    }, [pushNotification]),
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
      } catch (error) {
        pushNotification({
          message: `Failed to load mod database: ${error}`,
          severity: 'error',
        });
      } finally {
        setLoadingCount((count) => count - 1);
      }
    };

    setLoadingCount((count) => count + 1);
    getMods();
  }, [modDatabaseUrl, pushNotification]);

  useEffect(() => {
    setModMap(merge({}, remoteModMap, localModMap));
  }, [remoteModMap, localModMap]);

  useEffect(() => {
    for (const mod of Object.values(modMap)) {
      if (mod.errors.length > 0) {
        mod.errors.forEach((error) => {
          pushNotification({
            message: `Failed to load local mod: ${error}`,
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
