import React from 'react';
import { List, Paper } from '@material-ui/core';

import { SettingsContext, useSettings } from '../../hooks';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';

type SettingKey = keyof SettingsContext['settings'];
type OwmlSettingKey = keyof SettingsContext['owmlSettings'];

type SettingsInput = {
  key: SettingKey | OwmlSettingKey;
  label: string;
  tooltip?: string;
  isAdvanced?: boolean;
  isOwmlSetting?: boolean;
};

const settingsInputs: readonly SettingsInput[] = [
  {
    key: 'closeOnPlay',
    label: 'Close Mod Manager on game start',
    tooltip:
      "If you don't have a lot of ram to spare, closing the Mod Manager might improve game performance.",
  },
  {
    key: 'logToSocket',
    label: 'Send game logs to Mod Manager',
    tooltip:
      'If enabled, logs show in "Logs" tab. Otherwise, they will show in a separate console window. Disabling this might improve game performance.',
  },
  {
    key: 'combinationsBlockInput',
    label: 'Mod button combinations block game input',
    tooltip:
      'Some mods allow you to define custom button combinations for certain actions. Enabling this setting will block the default game input when one of these button combinations is detected.',
    isOwmlSetting: true,
  },
  {
    key: 'verbose',
    label: 'Verbose mode',
    tooltip: 'Shows more detailed info on logs',
    isOwmlSetting: true,
  },
  {
    key: 'gamePath',
    label: 'Game path',
    tooltip:
      'Game path will be determined automatically when you launch the game. Only change this if automatic detection fails.',
    isOwmlSetting: true,
  },
  {
    key: 'logLinesLimit',
    label: 'Log lines per page',
    tooltip:
      'Lower log line count might help with performance. Only has an effect if "Send game logs to Mod Manager" is enabled',
  },
  {
    key: 'showAdvancedSettings',
    label: 'Show Advanced Settings',
  },
  {
    key: 'modDatabaseUrl',
    label: 'Mod database URL',
    isAdvanced: true,
  },
];

const Settings = () => {
  const {
    settings: { showAdvancedSettings },
  } = useSettings();
  return (
    <List component={Paper}>
      {settingsInputs.map(
        ({ key, label, isAdvanced, isOwmlSetting, tooltip }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              {isOwmlSetting && (
                <OwmlSettingControl
                  settingKey={key as OwmlSettingKey}
                  label={label}
                  tooltip={tooltip}
                />
              )}
              {!isOwmlSetting && (
                <ModManagerSettingControl
                  settingKey={key as SettingKey}
                  label={label}
                  tooltip={tooltip}
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
