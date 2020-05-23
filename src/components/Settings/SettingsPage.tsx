import React from 'react';
import { List, Paper, Divider, ListItem } from '@material-ui/core';

import { SettingsContext, useSettings } from '../../hooks';
import SettingFormControl from './SettingFormControl';
import ResetSettings from './ResetSettings';

type SettingKey = keyof SettingsContext['settings'];

type SettingsInput = {
  key: SettingKey;
  label: string;
  isAdvanced?: boolean;
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
    key: 'showAdvancedSettings',
    label: 'Show Advanced Settings',
  },
  {
    key: 'modDatabaseUrl',
    label: 'Mod database URL',
    isAdvanced: true,
  },
  {
    key: 'modManagerRepo',
    label: 'Mod Manager repository',
    isAdvanced: true,
  },
] as const;

const Settings = () => {
  const {
    settings: { showAdvancedSettings },
  } = useSettings();
  return (
    <List component={Paper}>
      <ListItem>Update</ListItem>
      {settingsInputs.map(
        ({ key, label, isAdvanced }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              <SettingFormControl settingKey={key} label={label} />
              <Divider />
            </React.Fragment>
          ),
      )}
      <ResetSettings />
    </List>
  );
};

export default Settings;
