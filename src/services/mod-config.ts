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

async function getDefaultConfig(mod: Mod) {
  if (isDefaultConfigExisting(mod)) {
    const defaultConfig: ModConfig = await fs.readJson(
      getDefaultConfigPath(mod),
    );
    defaultConfig.enabled = true;
    return defaultConfig;
  }
  return {
    enabled: true,
  };
}

export async function saveConfig(mod: Mod, config: ModConfig) {
  return fs.writeJson(getConfigPath(mod), config);
}

export async function getConfig(mod: Mod) {
  if (!isConfigExisting(mod)) {
    const defaultConfig = await getDefaultConfig(mod);
    await saveConfig(mod, defaultConfig);
  }
  const config: ModConfig = await fs.readJson(getConfigPath(mod));
  return config;
}
