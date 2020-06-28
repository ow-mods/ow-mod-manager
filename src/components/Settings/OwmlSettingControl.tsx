import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl from './SettingFormControl';

type Props = {
  settingKey: keyof OwmlSettings;
  label: string;
  tooltip?: string;
};

const OwmlSettingControl: React.FunctionComponent<Props> = ({
  settingKey,
  label,
  tooltip,
}) => {
  const { owmlSettings, setOwmlSettings } = useSettings();
  const setting = owmlSettings[settingKey];

  const setSetting = useCallback(
    (value: boolean | string | number) =>
      setOwmlSettings({ [settingKey]: value }),
    [settingKey, setOwmlSettings],
  );

  return (
    <SettingFormControl
      value={setting}
      onChange={setSetting}
      label={label}
      tooltip={tooltip}
    />
  );
};

export default OwmlSettingControl;
