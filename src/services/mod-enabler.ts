import fs from 'fs-extra';

function getConfigPath(mod: Mod) {
  return `${mod.modPath}/config.json`;
}

function isConfigExisting(mod: Mod) {
  return fs.existsSync(getConfigPath(mod));
}

function saveConfig(mod: Mod, config: ModConfig) {
  fs.writeJSONSync(getConfigPath(mod), config);
}

function getConfig(mod: Mod): ModConfig {
  if (!isConfigExisting(mod)) {
    const defaultConfig: ModConfig = {
      enabled: true,
    };
    saveConfig(mod, defaultConfig);
  }
  return fs.readJSONSync(getConfigPath(mod));
}

export function isEnabled(mod: Mod): boolean {
  const config = getConfig(mod);
  return config.enabled;
}

export function toggleEnabled(mod: Mod) {
  const config = getConfig(mod);
  config.enabled = !isEnabled(mod);
  saveConfig(mod, config);
}
