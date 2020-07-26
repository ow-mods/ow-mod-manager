import fs from 'fs-extra';

import config from '../config.json';
import { settingsText } from '../static-text';

export function getSettings<TSettings>(path: string) {
  try {
    if (fs.existsSync(path)) {
      return fs.readJSONSync(path) as TSettings;
    }
  } catch (error) {
    console.error(settingsText.getSettingsError(path) + error);
  }
}

export function setSettings(settings: Settings) {
  if (!settings) {
    throw new Error(settingsText.setInvalidSettingsError);
  }
  const constrainedSettings: Settings = {
    ...settings,
    logToSocket: settings.closeOnPlay ? false : settings.logToSocket,
  };

  fs.writeJsonSync(config.settingsPath, constrainedSettings);
}

export function setOwmlSettings(path: string, settings: OwmlSettings) {
  if (!settings) {
    throw new Error(settingsText.setInvalidOwmlSettingsError);
  }
  fs.writeJsonSync(path, settings);
}

export function getOwmlSettingsPath(owmlPath: string) {
  return `${owmlPath}/${config.owmlSettingsFile}`;
}

export function getOwmlDefaultSettingsPath(owmlPath: string) {
  return `${owmlPath}/${config.owmlDefaultSettingsFile}`;
}
