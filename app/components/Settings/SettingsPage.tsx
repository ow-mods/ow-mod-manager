import React from 'react';
import { Container, List, Paper } from '@material-ui/core';

import { settingsText } from '../../helpers/static-text';
import { useSettings } from '../../hooks';
import AlphaDownload from './AlphaDownload';
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
  isAlpha?: boolean;
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
    key: 'owmlPath',
    type: SettingType.Path,
    isAdvanced: true,
  },
  {
    key: 'debugMode',
    type: SettingType.Switch,
    isOwmlSetting: true,
    isAdvanced: true,
  },
  {
    key: 'forceExe',
    type: SettingType.Switch,
    isOwmlSetting: true,
    isAdvanced: true,
  },
  {
    key: 'modDatabaseUrl',
    type: SettingType.Text,
    isAdvanced: true,
  },
  {
    key: 'alertSourceUrl',
    type: SettingType.Text,
    isAdvanced: true,
  },
  {
    key: 'disableModWarnings',
    type: SettingType.SwitchList,
    isAdvanced: true,
  },
  {
    key: 'showAlphaSettings',
    type: SettingType.Switch,
  },
  {
    key: 'alphaPath',
    type: SettingType.Path,
    isAlpha: true,
  },
  {
    key: 'cmowaPath',
    type: SettingType.Path,
    isAlpha: true,
  },
];

const Settings = () => {
  const {
    settings: { showAdvancedSettings, showAlphaSettings },
  } = useSettings();
  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <List component={Paper}>
          {settingsInputs.map(
            ({ key, isAdvanced, isAlpha, isOwmlSetting, type }) =>
              ((!isAdvanced && !isAlpha) ||
                (isAdvanced && showAdvancedSettings) ||
                (isAlpha && showAlphaSettings)) && (
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
          <AlphaDownload />
          <ResetSettings />
        </List>
      </Container>
    </PageContainer>
  );
};

export default Settings;
