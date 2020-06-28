import React, { useCallback } from 'react';

import { useSettings } from '../../hooks';
import SettingFormControl from './SettingFormControl';

type Props = {
  settingKey: keyof Settings;
  label: string;
  tooltip?: string;
};

const ModManagerSettingControl: React.FunctionComponent<Props> = ({
  settingKey,
  label,
  tooltip,
}) => {
  const { settings, setSettings } = useSettings();
  const setting = settings[settingKey];
  const isDisabled =
    (settingKey === 'logToSocket' && settings.closeOnPlay) ||
    (settingKey === 'logLinesLimit' && !settings.logToSocket);

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
      tooltip={tooltip}
    />
  );
};

export default ModManagerSettingControl;
