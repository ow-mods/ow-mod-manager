import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl, {
  SettingType,
  SettingValue,
} from './SettingFormControl';

type Props = {
  settingKey: keyof Settings;
  label: string;
  tooltip?: string;
  type: SettingType;
};

const ModManagerSettingControl: React.FunctionComponent<Props> = ({
  settingKey,
  label,
  tooltip,
  type,
}) => {
  const { settings, setSettings } = useSettings();
  const setting = settings[settingKey];
  const isDisabled =
    (settingKey === 'logToSocket' && settings.closeOnPlay) ||
    (settingKey === 'logLinesLimit' && !settings.logToSocket);

  const setSetting = useCallback(
    (value: SettingValue) => setSettings({ [settingKey]: value }),
    [settingKey, setSettings]
  );

  return (
    <SettingFormControl
      value={setting}
      type={type}
      onChange={setSetting}
      label={label}
      disabled={isDisabled}
      tooltip={tooltip}
    />
  );
};

export default ModManagerSettingControl;
