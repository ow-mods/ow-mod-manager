import React from 'react';
import { Container, List, Paper } from '@material-ui/core';

import { settingsText } from '../../helpers/static-text';
import { useSettings } from '../../hooks';
import AlphaLink from './AlphaLink';
import ResetSettings from './ResetSettings';
import ModManagerSettingControl from './ModManagerSettingControl';
import OwmlSettingControl from './OwmlSettingControl';
import { SettingType } from './SettingFormControl';
import PageContainer from '../PageContainer';

type SettingKey = keyof Settings;
type OwmlSettingKey = keyof OwmlSettings;

type SettingsInput = {
  key: SettingKey | OwmlSettingKey;
  isAlpha?: boolean;
  isOwmlSetting?: boolean;
  isCurrentGameSetting?: boolean;
  type: SettingType;
};

const settingsInputs: readonly SettingsInput[] = [
  {
    key: 'alphaMode',
    type: SettingType.Dropdown,
  },
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
    key: 'alphaPath',
    type: SettingType.Path,
    isAlpha: true,
  },
  {
    key: 'owmlPath',
    type: SettingType.Path,
    isCurrentGameSetting: true,
  },
  {
    key: 'owamlPath',
    type: SettingType.Path,
    isAlpha: true,
  },
  {
    key: 'logLinesLimit',
    type: SettingType.Slider,
  },
  {
    key: 'modDatabaseUrl',
    type: SettingType.Text,
  },
  {
    key: 'alertSourceUrl',
    type: SettingType.Text,
  },
  {
    key: 'debugMode',
    type: SettingType.Switch,
    isOwmlSetting: true,
  },
  {
    key: 'forceExe',
    type: SettingType.Switch,
    isOwmlSetting: true,
  },
  {
    key: 'incrementalGC',
    type: SettingType.Switch,
    isOwmlSetting: true,
  },
  {
    key: 'disableModWarnings',
    type: SettingType.SwitchList,
  },
];

const Settings = () => {
  const {
    settings: { alphaMode },
  } = useSettings();
  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <List component={Paper}>
          {settingsInputs.map(
            ({ key, isAlpha, isCurrentGameSetting, isOwmlSetting, type }) =>
              (alphaMode
                ? (!isCurrentGameSetting && !isOwmlSetting) || isAlpha
                : !isAlpha) && (
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
          {alphaMode && <AlphaLink />}
          <ResetSettings />
        </List>
      </Container>
    </PageContainer>
  );
};

export default Settings;
