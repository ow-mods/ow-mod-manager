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

function getDefaultConfig(mod: Mod) {
  if (isDefaultConfigExisting(mod)) {
    const defaultConfig: ModConfig = fs.readJsonSync(getDefaultConfigPath(mod));
    defaultConfig.enabled = true;
    return defaultConfig;
  }
  return {
    enabled: true,
  };
}

export function saveConfig(mod: Mod, config: ModConfig) {
  return fs.writeJsonSync(getConfigPath(mod), config);
}

export function getConfig(mod: Mod) {
  if (!isConfigExisting(mod)) {
    const defaultConfig = getDefaultConfig(mod);
    saveConfig(mod, defaultConfig);
  }
  const config: ModConfig = fs.readJsonSync(getConfigPath(mod));
  config.enabled = true;
  saveConfig(mod, config);
  return config;
}
