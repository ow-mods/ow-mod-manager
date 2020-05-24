import React, { useContext, useState, useCallback } from 'react';

import { downloadAppUpdate } from '../services';
import { useNotifications } from './use-notifications';
import { useAppState } from './use-app-state';

const defaultState = {
  isDownloading: false,
  isUpdateReady: false,
  progress: 0,
};

type AppUpdateState = typeof defaultState;

interface AppUpdateContext extends AppUpdateState {
  updateApp: () => void;
}

const AppUpdate = React.createContext<AppUpdateContext>({
  ...defaultState,
  updateApp: () => {},
});

export const useAppUpdate = () => useContext(AppUpdate);

export const AppUpdateProvider: React.FunctionComponent = ({ children }) => {
  const { appRelease } = useAppState();
  const { pushNotification } = useNotifications();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateApp = useCallback(() => {
    (async () => {
      setIsDownloading(true);
      try {
        if (!appRelease) {
          throw new Error(
            'Not able to retrieve Mod Manager release from database',
          );
        }
        await downloadAppUpdate(appRelease.downloadUrl, (newProgress) => {
          setProgress(newProgress);
        });
        setIsUpdateReady(true);
        pushNotification({
          message: `Finished downloading app update`,
          severity: 'success',
        });
      } catch (error) {
        pushNotification({
          message: `Error updating app: ${error}`,
          severity: 'error',
        });
      } finally {
        setIsDownloading(false);
        setProgress(0);
      }
    })();
  }, [pushNotification, appRelease]);

  return (
    <AppUpdate.Provider
      value={{
        isDownloading,
        progress,
        updateApp,
        isUpdateReady,
      }}
    >
      {children}
    </AppUpdate.Provider>
  );
};
