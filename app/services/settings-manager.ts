import fs from 'fs-extra';
import { remote } from 'electron';

import config from '../config.json';
import { settingsText } from '../helpers/static-text';
import { debugConsole } from '../helpers/console-log';

export const defaultAppSettings = {
  ...config.defaultSettings,
  owmlPath: `${remote.app.getPath('userData')}\\OWML`,
  cmowaPath: `${remote.app.getPath('userData')}\\CMOWA`,
};

export function getSettingsPath() {
  return `${remote.app.getPath('userData')}\\${config.settingsPath}`;
}

export async function getSettings<TSettings>(path: string) {
  try {
    if (fs.existsSync(path)) {
      return (await fs.readJson(path)) as TSettings;
    }
  } catch (error) {
    debugConsole.error(settingsText.getSettingsError(path) + error);
  }
  return undefined;
}

export function writeSettings(settings: Settings) {
  if (!settings) {
    throw new Error(settingsText.setInvalidSettingsError);
  }

  debugConsole.log('writing app settings');

  const constrainedSettings: Settings = {
    ...settings,
    logToSocket: settings.closeOnPlay ? false : settings.logToSocket,
  };

  fs.writeJsonSync(getSettingsPath(), constrainedSettings);
}

export function writeOwmlSettings(path: string, settings: OwmlSettings) {
  if (!settings) {
    throw new Error(settingsText.setInvalidOwmlSettingsError);
  }
  fs.writeJsonSync(path, settings);
}

export function getOwmlSettingsPath(owmlPath: string) {
  return owmlPath ? `${owmlPath}/${config.owmlSettingsFile}` : '';
}

export function getOwmlDefaultSettingsPath(owmlPath: string) {
  return owmlPath ? `${owmlPath}/${config.owmlDefaultSettingsFile}` : '';
}