import fs from 'fs-extra';

function getDefaultConfigPath(mod: Mod) {
  return `${mod.modPath}/default-config.json`;
}

function getConfigPath(mod: Mod) {
  return `${mod.modPath}/config.json`;
}

function isDefaultConfigExisting(mod: Mod) {
  return fs.existsSync(getDefaultConfigPath(mod));
}

function isConfigExisting(mod: Mod) {
  return fs.existsSync(getConfigPath(mod));
}

function saveConfig(mod: Mod, config: ModConfig) {
  fs.writeJSONSync(getConfigPath(mod), config);
}

function getDefaultConfig(mod: Mod): ModConfig {
  if (isDefaultConfigExisting(mod)) {
    const defaultConfig: ModConfig = fs.readJSONSync(getDefaultConfigPath(mod));
    defaultConfig.enabled = true;
    return defaultConfig;
  } else {
    return {
      enabled: true,
    };
  }
}

function getConfig(mod: Mod): ModConfig {
  if (!isConfigExisting(mod)) {
    const defaultConfig = getDefaultConfig(mod);
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
  config.enabled = !config.enabled;
  saveConfig(mod, config);
}
