import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl from './SettingFormControl';

const OwmlSettingControl: React.FunctionComponent<{
  settingKey: keyof OwmlSettings;
  label: string;
}> = ({ settingKey, label }) => {
  const { owmlSettings, setOwmlSettings } = useSettings();
  const setting = owmlSettings[settingKey];

  const setSetting = useCallback(
    (value: boolean | string | number) =>
      setOwmlSettings({ [settingKey]: value }),
    [settingKey, setOwmlSettings],
  );

  return (
    <SettingFormControl value={setting} onChange={setSetting} label={label} />
  );
};

export default OwmlSettingControl;
