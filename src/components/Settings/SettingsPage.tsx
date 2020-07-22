import React from 'react';
import { List, Paper } from '@material-ui/core';

import { settingsText } from '../../static-text';
import { SettingsContext, useSettings } from '../../hooks';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';

type SettingKey = keyof SettingsContext['settings'];
type OwmlSettingKey = keyof SettingsContext['owmlSettings'];

type SettingsInput = {
  key: SettingKey | OwmlSettingKey;
  isAdvanced?: boolean;
  isOwmlSetting?: boolean;
};

const settingsInputs: readonly SettingsInput[] = [
  {
    key: 'closeOnPlay',
  },
  {
    key: 'logToSocket',
  },
  {
    key: 'combinationsBlockInput',
    isOwmlSetting: true,
  },
  {
    key: 'verbose',
    isOwmlSetting: true,
  },
  {
    key: 'openVRParameter',
  },
  {
    key: 'gamePath',
    isOwmlSetting: true,
  },
  {
    key: 'logLinesLimit',
  },
  {
    key: 'showAdvancedSettings',
  },
  {
    key: 'modDatabaseUrl',
    isAdvanced: true,
  },
  {
    key: 'disableParameterWarning',
    isAdvanced: true,
  },
  {
    key: 'owmlPath',
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
        ({ key, isAdvanced, isOwmlSetting }) =>
          (!isAdvanced || showAdvancedSettings) && (
            <React.Fragment key={key}>
              {isOwmlSetting && (
                <OwmlSettingControl
                  settingKey={key as OwmlSettingKey}
                  label={settingsText[key].label}
                  tooltip={settingsText[key].tooltip}
                />
              )}
              {!isOwmlSetting && (
                <ModManagerSettingControl
                  settingKey={key as SettingKey}
                  label={settingsText[key].label}
                  tooltip={settingsText[key].tooltip}
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
