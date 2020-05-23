import React, { useCallback } from 'react';

import { useSettings, SettingsContext } from '../../hooks';
import SwitchInput from './SwitchInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';

const SettingFormControl: React.FunctionComponent<{
  settingKey: keyof SettingsContext['settings'];
  label: string;
}> = ({ settingKey, label }) => {
  const { settings, setSettings } = useSettings();
  const setting = settings[settingKey];

  const setSetting = useCallback(
    (value: boolean | string | number) => setSettings({ [settingKey]: value }),
    [settingKey, setSettings],
  );

  if (typeof setting === 'boolean') {
    return <SwitchInput value={setting} onChange={setSetting} label={label} />;
  }

  if (typeof setting === 'string') {
    return <TextInput value={setting} onChange={setSetting} label={label} />;
  }

  if (typeof setting === 'number') {
    return <SliderInput value={setting} onChange={setSetting} label={label} />;
  }

  return null;
};

export default SettingFormControl;
