import fs from 'fs-extra';

import config from '../config.json';

export function getSettings<TSettings>(path: string) {
  const settings: TSettings = fs.existsSync(path)
    ? fs.readJSONSync(path)
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
