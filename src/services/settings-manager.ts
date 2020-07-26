import fs from 'fs-extra';

import config from '../config.json';

export function getSettings<TSettings>(path: string) {
  try {
    if (fs.existsSync(path)) {
      return fs.readJSONSync(path) as TSettings;
    }
  } catch (error) {
    console.error(`Error while getting settings file in "${path}": ${error}`);
  }
}

export function setSettings(settings: Settings) {
  if (!settings) {
    throw new Error('Trying to set invalid OWML settings');
  }
  const constrainedSettings: Settings = {
    ...settings,
    logToSocket: settings.closeOnPlay ? false : settings.logToSocket,
  };

  fs.writeJsonSync(config.settingsPath, constrainedSettings);
}

export function setOwmlSettings(path: string, settings: OwmlSettings) {
  if (!settings) {
    throw new Error('Trying to set invalid OWML settings');
  }
  fs.writeJsonSync(path, settings);
}

export function getOwmlSettingsPath(owmlPath: string) {
  return `${owmlPath}/${config.owmlSettingsFile}`;
}

export function getOwmlDefaultSettingsPath(owmlPath: string) {
  return `${owmlPath}/${config.owmlDefaultSettingsFile}`;
}
