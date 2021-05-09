import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl, {
  SettingType,
  SettingValue,
} from './SettingFormControl';

type Props = {
  settingKey: keyof OwmlSettings;
  label: string;
  tooltip?: string;
  type: SettingType;
};

const OwmlSettingControl: React.FunctionComponent<Props> = ({
  settingKey,
  label,
  tooltip,
  type,
}) => {
  const { owmlSettings, setOwmlSettings } = useSettings();
  const setting = owmlSettings[settingKey];

  const setSetting = useCallback(
    (value: SettingValue) => setOwmlSettings({ [settingKey]: value }),
    [settingKey, setOwmlSettings]
  );

  return (
    <SettingFormControl
      value={setting}
      onChange={setSetting}
      label={label}
      tooltip={tooltip}
      type={type}
    />
  );
};

export default OwmlSettingControl;
