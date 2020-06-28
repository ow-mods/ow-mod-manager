import React from 'react';
import { List, Paper, Divider } from '@material-ui/core';

import { SettingsContext, useSettings } from '../../hooks';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';

type SettingKey = keyof SettingsContext['settings'];
type OwmlSettingKey = keyof SettingsContext['owmlSettings'];

type SettingsInput = {
  label: string;
  isAdvanced?: boolean;
};

interface ModManagerSettingsInput extends SettingsInput {
  key: SettingKey;
}

interface OwmlSettingsInput extends SettingsInput {
  key: OwmlSettingKey;
}

const settingsInputs: readonly ModManagerSettingsInput[] = [
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
] as const;

const owmlSettingsInputs: readonly OwmlSettingsInput[] = [
  {
    key: 'gamePath',
    label: 'Game path',
  },
  {
    key: 'verbose',
    label: 'Verbose mode',
    isAdvanced: true,
  },
  {
    key: 'combinationsBlockInput',
    label: 'Mod button combinations block game input',
  },
] as const;

const Settings = () => {
  const {
    settings: { showAdvancedSettings },
  } = useSettings();
  return (
    <List component={Paper}>
      {settingsInputs.map(
        ({ key, label, isAdvanced }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              <ModManagerSettingControl settingKey={key} label={label} />
            </React.Fragment>
          ),
      )}
      {owmlSettingsInputs.map(
        ({ key, label, isAdvanced }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              <OwmlSettingControl settingKey={key} label={label} />
            </React.Fragment>
          ),
      )}
      <ResetSettings />
    </List>
  );
};

export default Settings;
