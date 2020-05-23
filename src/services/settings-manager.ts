import fs from 'fs-extra';

import config from '../config.json';

export function getSettings() {
  const settings: Settings = fs.existsSync(config.settingsPath)
    ? fs.readJSONSync(config.settingsPath)
    : null;

  return settings;
}

export function setSettings(settings: Settings) {
  fs.writeJsonSync(config.settingsPath, settings);
}
