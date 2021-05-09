import React from 'react';
import { Container, List, Paper } from '@material-ui/core';

import { settingsText } from '../../static-text';
import { useSettings } from '../../hooks';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';
import { SettingType } from './SettingFormControl';
import PageContainer from '../PageContainer';

type SettingKey = keyof Settings;
type OwmlSettingKey = keyof OwmlSettings;

type SettingsInput = {
  key: SettingKey | OwmlSettingKey;
  isAdvanced?: boolean;
  isOwmlSetting?: boolean;
  type: SettingType;
};

const settingsInputs: readonly SettingsInput[] = [
  {
    key: 'closeOnPlay',
    type: SettingType.Switch,
  },
  {
    key: 'logToSocket',
    type: SettingType.Switch,
  },
  {
    key: 'combinationsBlockInput',
    type: SettingType.Switch,
    isOwmlSetting: true,
  },
  {
    key: 'openVRParameter',
    type: SettingType.Switch,
  },
  {
    key: 'gamePath',
    type: SettingType.Path,
    isOwmlSetting: true,
  },
  {
    key: 'logLinesLimit',
    type: SettingType.Slider,
  },
  {
    key: 'showAdvancedSettings',
    type: SettingType.Switch,
  },
  {
    key: 'modDatabaseUrl',
    type: SettingType.Text,
    isAdvanced: true,
  },
  {
    key: 'disableParameterWarning',
    type: SettingType.Switch,
    isAdvanced: true,
  },
  {
    key: 'owmlPath',
    type: SettingType.Text,
    isAdvanced: true,
  },
];

const Settings = () => {
  const {
    settings: { showAdvancedSettings },
  } = useSettings();
  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <List component={Paper}>
          {settingsInputs.map(
            ({ key, isAdvanced, isOwmlSetting, type }) =>
              (!isAdvanced || showAdvancedSettings) && (
                <React.Fragment key={key}>
                  {isOwmlSetting && (
                    <OwmlSettingControl
                      settingKey={key as OwmlSettingKey}
                      label={settingsText[key].label}
                      tooltip={settingsText[key].tooltip}
                      type={type}
                    />
                  )}
                  {!isOwmlSetting && (
                    <ModManagerSettingControl
                      settingKey={key as SettingKey}
                      label={settingsText[key].label}
                      tooltip={settingsText[key].tooltip}
                      type={type}
                    />
                  )}
                </React.Fragment>
              )
          )}
          <ResetSettings />
        </List>
      </Container>
    </PageContainer>
  );
};

export default Settings;
