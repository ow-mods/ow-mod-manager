export const globalText = {
  tabs: {
    mods: 'Mods',
    logs: 'Logs',
    settings: 'Settings',
    update: 'Update',
  },
  startGame: 'Start Game',
  startAlpha: 'Start Alpha',
  gameRunning: 'Already running',
  missingRequiredMod: (modNames: string[]) =>
    `Please install ${modNames.join(', ')} before starting the game`,
  alphaWebsite: 'Download at Outer Wilds Alpha Website',
  alphaPathMissing: 'You need to set the path to the game folder in settings.',
  owamlPathMissing: 'You need to set the path to the OWAML folder in settings.',
  dialog: {
    ok: 'OK',
    cancel: 'Cancel',
    dontShowAgain: "Don't show this again",
  },
};

export const logsText = {
  showingLines: (count: number) => `Showing ${count} of `,
  entries: (count: number) => `${count} entries`,
  page: (count: number) => `, page ${count}`,
  showPrevious: (count: number) => `Show previous ${count}`,
  showNext: (count: number) => `Show next ${count}`,
  filterLogsLabel: 'Filter logs',
  clearLogs: 'Clear log entries',
  connectedToConsole: 'Client connected to console',
  allMods: 'All logs',
  disconnectedFromConsole: 'Client disconnected from console',
  consoleServerStart: (port: number) =>
    `Started console server on port ${port}`,
  socketError: 'SOCKET ERROR',
  messageParseError: 'Error parsing OWML log message',
};

export const modsText = {
  toolbar: {
    findModsLabel: 'Find mods',
    modsDirectory: 'Mods directory',
  },
  emptyModList: 'No mods here! 😱',
  missingAlphaPath:
    'Before installing mods, you need to set the path to the Outer Wilds Alpha folder in the manager settings.',
  tableHead: {
    author: 'Author',
    downloadCount: 'Downloads',
    version: 'Version',
    actions: '',
  },
  modSections: {
    required: 'Required mods',
    enabled: 'Enabled mods',
    installed: 'Installed mods (disabled)',
    notInstalled: 'Available mods',
  },
  modManager: {
    name: 'Outer Wilds Mod Manager',
    description: `The app you're currently looking at.`,
    author: 'Raicuparta & Alek',
  },
  versionNotAvailable: 'Not Available',
  outdated: 'Outdated',
  actions: {
    disableRequired: "Required, can't disable",
    disable: 'Disable',
    enable: 'Enable',
    loading: 'Loading...',
    reinstall: 'Reinstall',
    cantReinstall: 'Could not find mod in database',
    update: (version: string) => `Update to ${version}`,
    alreadyInstalled: 'Installed and up to date',
    install: 'Install',
    more: 'More...',
    readme: 'Readme',
    openDirectory: 'Show in explorer',
    openRepo: 'More info on GitHub',
    uninstall: 'Uninstall',
    installPrerelease: (version: string) => `Install Prerelease (${version})`,
  },
  localModLoadError: 'Failed to load local mod',
  databaseLoadError: 'Failed to load mod database',
  deleteNonExistingError: 'Trying to delete a non-existing directory',
  uninstallNotInstalledError: "Can't uninstall mod because it's not installed",
  modPathNotDefinedError: 'Mod path is not defined',
  openNonExistingDirectoryError: 'Trying to open non existing directory',
  undefinedRepoUrlError: 'Mod repository URL not defined',
  patcherWarning: (modName: string) =>
    `${modName} possibly modified game files. In order to disable it completely, use the "verify game files" option in Steam / Epic. Check ${modName}'s readme for more information.`,
  missingDependencyWarning: (dependencyNames: string) =>
    `This mod requires ${dependencyNames}. Install dependencies from the top of the mod list. If you can't find them there, contact the mod author.`,
  conflictingModWarning: (conflictNames: string) =>
    `This mod is not compatible with ${conflictNames}. Disable or uninstall the conflicting mods to prevent your game from crashing.`,
  missingManifestAttributesError: (path: string, attributes: string[]) =>
    `Manifest ${path} missing attributes "${attributes.join('", "')}"`,
  modLoadError: (errors: string[]) =>
    `Encountered problems loading the mod: ${errors.join(' || ')}`,
  actionError: (action: string, error: string) =>
    `Error executing mod ${action}: ${error}`,
  duplicateModError: (modUniqueName: string) =>
    `Found multiple mods with the same uniqueName (${modUniqueName}). Open the mods directory and make sure you only have one copy of each mod.`,
  brokenManifestError: (directoryName: string, error: string) =>
    `Failed to read manifest.json in mod directory "${directoryName}". Reinstall the mod or contact the mod author to fix this issue. Error: ${error}`,
  brokenConfigError: (error: string) =>
    `Failed to read mod configuration files: "${error}"`,
};

export const settingsText = {
  closeOnPlay: {
    label: 'Close Mod Manager on game start',
    tooltip:
      "If you don't have a lot of ram to spare, closing the Mod Manager might improve game performance.",
  },
  logToSocket: {
    label: 'Send game logs to Mod Manager',
    tooltip:
      'If enabled, logs show in "Logs" tab. Otherwise, they will show in a separate console window. Disabling this might improve game performance.',
  },
  gamePath: {
    label: 'Game folder (contains game exe)',
    tooltip:
      'Game path will be determined automatically when you launch the game. Leave empty for automatic detection on launch.',
  },
  debugMode: {
    label: 'OWML debug mode',
    tooltip: 'Makes OWML log more stuff',
  },
  forceExe: {
    label: 'Launch game exe directly',
    tooltip:
      'If enabled, launches game exe instead of launching via Steam / Epic. Needs to be disabled for DLC to work via the Epic store.',
  },
  logLinesLimit: {
    label: 'Log lines per page',
    tooltip:
      'Lower log line count might help with performance. Only has an effect if "Send game logs to Mod Manager" is enabled',
  },
  modDatabaseUrl: {
    label: 'Mod database URL',
    tooltip: 'URL used to check for updates for mods and OWML',
    isAdvanced: true,
  },
  alertSourceUrl: {
    label: 'Alert source URL',
    tooltip: 'URL used to get alerts to display in the Mod Manager.',
    isAdvanced: true,
  },
  owmlPath: {
    label: 'OWML path',
    tooltip:
      "Can be relative to Mod Manager or an absolute path. All mods are installed in a 'Mods' folder inside this.",
  },
  disableModWarnings: {
    label: 'Disable warning for mod',
    tooltip:
      'Prevents this mod from showing warnings in the Mod Manager when starting the game',
  },
  alphaMode: {
    label: 'Game version to use|Current Outer Wilds|Outer Wilds Alpha',
    tooltip:
      '"Current Outer Wilds" is the one you can buy on Steam, Epic, Game Pass, etc. "Outer Wilds Alpha" is an old version they used to have on their website.',
  },
  alphaPath: {
    label: 'Alpha game folder',
    tooltip: 'Path to Outer Wilds Alpha (contains alpha game exe)',
    isAlpha: true,
  },
  owamlPath: {
    label: 'OWAML path',
    tooltip: 'Can be relative to Mod Manager or an absolute path.',
    isAlpha: true,
  },
  textFieldSave: 'Save',
  pathFindButton: 'Find...',
  pathFindTitle: `Find folder that contains game exe...`,
  resetToDefault: 'Reset all settings to default',
  getSettingsError: (path: string) =>
    `Error while getting settings file in ${path}: `,
  setInvalidSettingsError: 'Trying to set invalid settings',
  setInvalidOwmlSettingsError: 'Trying to set invalid OWML settings',
};

export const updateText = {
  dialogYes: 'Restart app and update',
  dialogNo: 'Not now, update later',
  dialogTitle: 'Outer Wilds Mod Manager',
  dialogMessage: 'Update available',
  dialogDetail: (version: string) =>
    `An update is available for version ${version} of the Mod Manager.`,
};
