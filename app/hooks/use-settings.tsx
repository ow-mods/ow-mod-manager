import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { settingsState, owmlSettingsState } from '../store';
import {
  writeOwmlSettings,
  writeSettings,
  getOwmlSettingsPath,
} from '../services';

export const useSettings = () => {
  const [settings] = useRecoilState(settingsState);
  const [owmlSettings] = useRecoilState(owmlSettingsState);

  const setSettingsPartial = useCallback(
    (newSettings: Partial<Settings>) => {
      writeSettings({
        ...settings,
        ...newSettings,
      });
    },
    [settings]
  );

  const setOwmlSettingsPartial = useCallback(
    (newSettings: Partial<OwmlSettings>) => {
      writeOwmlSettings(getOwmlSettingsPath(settings.owmlPath), {
        ...owmlSettings,
        ...newSettings,
      });
    },
    [settings.owmlPath, owmlSettings]
  );

  return {
    settings,
    owmlSettings,
    setSettings: setSettingsPartial,
    setOwmlSettings: setOwmlSettingsPartial,
  };
};
