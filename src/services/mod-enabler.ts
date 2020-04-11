import fs from 'fs-extra';

function getConfigPath(mod: Mod) {
  return `${mod.modPath}/config.json`;
}

function isConfigExisting(mod: Mod) {
  return fs.existsSync(getConfigPath(mod));
}

function saveConfig(mod: Mod, config: ModConfig) {
  fs.writeJSONSync(getConfigPath(mod), config, {});
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

export function enable(mod: Mod) {
  if (isEnabled(mod)) {
    throw new Error("Can't enable mod because it's already enabled");
  }
  const config = getConfig(mod);
  config.enabled = true;
  saveConfig(mod, config);
}

export function disable(mod: Mod) {
  if (!isEnabled(mod)) {
    throw new Error("Can't disable mod because it's already disabled");
  }
  const config = getConfig(mod);
  config.enabled = false;
  saveConfig(mod, config);
}
