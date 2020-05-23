import React from 'react';
import { List, Paper, Divider } from '@material-ui/core';

import { SettingsContext } from '../../hooks';
import SettingFormControl from './SettingFormControl';

type SettingKey = keyof SettingsContext['settings'];

type SettingsInput = {
  key: SettingKey;
  label: string;
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
    key: 'logLinesLimit',
    label: 'Log lines per page',
  },
  {
    key: 'modDatabaseUrl',
    label: 'Mod database URL',
  },
] as const;

const Settings = () => (
  <List component={Paper}>
    {settingsInputs.map(({ key, label }) => (
      <React.Fragment key={key}>
        <SettingFormControl settingKey={key} label={label} />
      </React.Fragment>
    ))}
  </List>
);

export default Settings;
