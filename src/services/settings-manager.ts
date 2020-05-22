import fs from 'fs-extra';

import config from '../config.json';

export function getSettings() {
  const settings: SettingsState = fs.existsSync(config.settingsPath)
    ? fs.readJSONSync(config.settingsPath)
    : null;

  return settings;
}
