import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl from './SettingFormControl';

const ModManagerSettingControl: React.FunctionComponent<{
  settingKey: keyof Settings;
  label: string;
}> = ({ settingKey, label }) => {
  const { settings, setSettings } = useSettings();
  const setting = settings[settingKey];
  const isDisabled = settingKey === 'logToSocket' && settings.closeOnPlay;

  const setSetting = useCallback(
    (value: boolean | string | number) => setSettings({ [settingKey]: value }),
    [settingKey, setSettings],
  );

  return (
    <SettingFormControl
      value={setting}
      onChange={setSetting}
      label={label}
      disabled={isDisabled}
    />
  );
};

export default ModManagerSettingControl;
