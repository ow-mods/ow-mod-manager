import React, { useContext, useState, useCallback, useEffect } from 'react';

import { downloadAppUpdate, getIsAppOutdated } from '../services';
import { useSettings } from './use-settings';
import { useNotifications } from './use-notifications';

const defaultState = {
  isAppOutdated: false,
  isDownloading: false,
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
  const {
    settings: { modManagerRepo },
  } = useSettings();
  const { pushNotification } = useNotifications();
  const [isAppOutdated, setIsAppOutdated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateState = async () => {
      setIsAppOutdated(await getIsAppOutdated(modManagerRepo));
    };
    updateState();
  }, [modManagerRepo]);

  const updateApp = useCallback(() => {
    (async () => {
      setIsDownloading(true);
      try {
        await downloadAppUpdate((newProgress) => {
          setProgress(newProgress);
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
  }, [pushNotification]);

  return (
    <AppUpdate.Provider
      value={{
        isAppOutdated,
        isDownloading,
        progress,
        updateApp,
      }}
    >
      {children}
    </AppUpdate.Provider>
  );
};
