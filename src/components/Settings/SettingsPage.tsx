import React from 'react';
import { List, Paper, Divider } from '@material-ui/core';

import { SettingsContext, useSettings } from '../../hooks';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';

type SettingKey = keyof SettingsContext['settings'];
type OwmlSettingKey = keyof SettingsContext['owmlSettings'];

type SettingsInput = {
  key: SettingKey | OwmlSettingKey;
  label: string;
  isAdvanced?: boolean;
  isOwmlSetting?: boolean;
};

const settingsInputs: readonly SettingsInput[] = [
  {
    key: 'closeOnPlay',
    label: 'Close Mod Manager on game start',
  },
  {
    key: 'logToSocket',
    label: 'Send game logs to Mod Manager',
  },
  {
    key: 'combinationsBlockInput',
    label: 'Mod button combinations block game input',
    isOwmlSetting: true,
  },

  {
    key: 'verbose',
    label: 'Verbose mode',
    isAdvanced: true,
    isOwmlSetting: true,
  },
  {
    key: 'showAdvancedSettings',
    label: 'Show Advanced Settings',
  },
  {
    key: 'logLinesLimit',
    label: 'Log lines per page',
  },
  {
    key: 'modDatabaseUrl',
    label: 'Mod database URL',
    isAdvanced: true,
  },
  {
    key: 'gamePath',
    label: 'Game path',
    isOwmlSetting: true,
  },
];

const Settings = () => {
  const {
    settings: { showAdvancedSettings },
  } = useSettings();
  return (
    <List component={Paper}>
      {settingsInputs.map(
        ({ key, label, isAdvanced, isOwmlSetting }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              {isOwmlSetting && (
                <OwmlSettingControl
                  settingKey={key as OwmlSettingKey}
                  label={label}
                />
              )}
              {!isOwmlSetting && (
                <ModManagerSettingControl
                  settingKey={key as SettingKey}
                  label={label}
                />
              )}
            </React.Fragment>
          ),
      )}
      <ResetSettings />
    </List>
  );
};

export default Settings;
