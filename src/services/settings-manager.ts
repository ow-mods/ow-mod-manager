import fs from 'fs-extra';

import config from '../config.json';

export function getSettings() {
  const settings: Settings = fs.existsSync(config.settingsPath)
    ? fs.readJSONSync(config.settingsPath)
    : null;

  return settings;
}

export function setSettings(settings: Settings) {
  const constrainedSettings: Settings = {
    ...settings,
    logToSocket: settings.closeOnPlay ? false : settings.logToSocket,
  };

  fs.writeJsonSync(config.settingsPath, constrainedSettings);
}

export function setOwmlSettings(settings: OwmlSettings) {
  fs.writeJsonSync(config.owmlSettingsPath, settings);
}
