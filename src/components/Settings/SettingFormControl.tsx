import React from 'react';

import { useSettings, SettingsContext } from '../../hooks';
import SwitchInput from './SwitchInput';
import SliderInput from './SliderInput';

const SettingFormControl: React.FunctionComponent<{
  settingKey: keyof SettingsContext['settings'];
  label: string;
}> = ({ settingKey, label }) => {
  const { settings, setSettings } = useSettings();
  const setting = settings[settingKey];

  if (typeof setting === 'boolean') {
    return (
      <SwitchInput
        value={setting}
        onChange={(value) => setSettings({ [settingKey]: value })}
        label={label}
      />
    );
  }

  if (typeof setting === 'string') {
    return <>text: {setting}</>;
  }

  if (typeof setting === 'number') {
    return (
      <SliderInput
        value={setting}
        onChange={(value) => setSettings({ [settingKey]: value })}
        label={label}
      />
    );
  }

  return null;
};

export default SettingFormControl;
