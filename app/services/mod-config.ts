import fs from 'fs-extra';
import { modsText } from '../helpers/static-text';

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
    return fs.readJsonSync(getDefaultConfigPath(mod)) as ModConfig;
  }
  return {
    enabled: true,
  };
}

export function saveConfig(mod: Mod, config: ModConfig) {
  return fs.writeJsonSync(getConfigPath(mod), config);
}

export function getConfig(mod: Mod) {
  try {
    if (!isConfigExisting(mod)) {
      const defaultConfig = getDefaultConfig(mod);
      saveConfig(mod, defaultConfig);
    }
    const config: ModConfig = fs.readJsonSync(getConfigPath(mod));
    return config;
  } catch (error) {
    mod.errors.push(modsText.brokenConfigError(error));
    return undefined;
  }
}
