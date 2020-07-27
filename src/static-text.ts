export const globalText = {
  find: 'Find',
  tabs: {
    mods: 'Mods',
    logs: 'Logs',
    settings: 'Settings',
    update: 'Update',
  },
  startGame: 'Start Game',
  gameRunning: 'Already running',
  missingRequiredMod: (modNames: string[]) =>
    `Please install ${modNames.join()} before starting the game`,
};

export const logsText = {
  showingLines: (count: number) => `Showing ${count} of `,
  entries: (count: number) => `${count} entries`,
  page: (count: number) => `, page ${count}`,
  showPrevious: (count: number) => `Show previous ${count}`,
  showNext: (count: number) => `Show previous ${count}`,
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
  selectFilter: {
    all: 'All mods',
    installed: 'Installed',
    enabled: 'Enabled',
    notInstalled: 'Not Installed',
    outdated: 'Outdated',
  },
  emptyModList: 'No mods here! 😱',
  tableHead: {
    name: 'Name',
    author: 'Author',
    downloadCount: 'Downloads',
    version: 'Version',
    actions: '',
  },
  modSections: {
    required: 'Required: install before starting the game',
    installed: 'Installed',
    notInstalled: 'Available mods',
  },
  versionNotAvailable: 'Not Available',
  actions: {
    disableRequired: "Required, can't disable",
    disable: 'Disable',
    enable: 'Enable',
    loading: 'Loading...',
    update: (version: string) => `Update to ${version}`,
    alreadyInstalled: 'Already installed',
    install: 'Install',
    more: 'More...',
    openDirectory: 'Show in explorer',
    openRepo: 'More info on GitHub',
    uninstall: 'Uninstall',
  },
  localModLoadError: 'Failed to load local mod',
  databaseLoadError: 'Failed to load mod database',
  deleteNonExistingError: 'Trying to delete a non-existing directory',
  installAlreadyInstalledError:
    "Can't install mod because it's already installed",
  updateNotOutOfDateError: "Can't update mod because it's not out of date",
  uninstallNotInstalledError: "Can't uninstall mod because it's not installed",
  modPathNotDefinedError: 'Mod path is not defined',
  openNonExistingDirectoryError: 'Trying to open non existing directory',
  undefinedRepoUrlError: 'Mod repository URL not defined',
  missingManifestAttributesError: (path: string, attributes: string[]) =>
    `Manifest ${path} missing attributes "${attributes.join('", "')}"`,
  modLoadError: (errors: string[]) =>
    `Failed to load mod. Errors: ${errors.join(' || ')}`,
  actionError: (action: string, error: string) =>
    `Error executing mod ${action}: ${error}`,
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
  combinationsBlockInput: {
    label: 'Mod button combinations block game input',
    tooltip:
      'Some mods allow you to define custom button combinations for certain actions. Enabling this setting will block the default game input when one of these button combinations is detected.',
    isOwmlSetting: true,
  },
  openVRParameter: {
    label: 'Force OpenVR mode',
    tooltip:
      'Runs game with -vrmode openvr flag. Required to make VR work in some rare cases',
  },
  gamePath: {
    label: 'Game path',
    tooltip:
      'Game path will be determined automatically when you launch the game. Leave empty for automatic detection on launch.',
    isOwmlSetting: true,
  },
  logLinesLimit: {
    label: 'Log lines per page',
    tooltip:
      'Lower log line count might help with performance. Only has an effect if "Send game logs to Mod Manager" is enabled',
  },
  showAdvancedSettings: {
    label: 'Show Advanced Settings',
    tooltip: '',
  },
  modDatabaseUrl: {
    label: 'Mod database URL',
    tooltip:
      'URL used to check for updates for mods, OWML, and the Mod Manager.',
    isAdvanced: true,
  },
  disableParameterWarning: {
    label: 'Disable Steam parameter warning',
    tooltip:
      'Disables warning in the Mod Manager that warns you about the Steam warning. Yeah.',
    isAdvanced: true,
  },
  owmlPath: {
    label: 'OWML path',
    tooltip:
      "Can be relative to Mod Manager or an absolute path. All mods are installed in a 'Mods' folder inside this.",
  },
  textFieldSave: 'Save',
  resetToDefault: 'Reset all settings to default',
  getSettingsError: (path: string) =>
    `Error while getting settings file in ${path}: `,
  setInvalidSettingsError: 'Trying to set invalid settings',
  setInvalidOwmlSettingsError: 'Trying to set invalid OWML settings',
  steamParamsWarning: {
    message: 'Steam might show a warning before starting the game',
    dontShowAgain: "Don't show this again",
    ok: 'OK',
    cancel: 'Cancel',
    detail: (paramNames: string[]) => `You enabled "${paramNames.join(
      '" and "',
    )}".
  
If you own the Steam version of the game, Steam might show a warning about custom parameters.
    
The warning might not be visible until you open a Steam window.
    
If you have SteamVR running, the warning might only be visible while you're using your VR headset.
    
If you want Steam to stop bothering you about this, you'll have to disable these options in the Mod Manager settings.`,
  },
};

export const updateText = {
  unableToGetRelease: 'Unable to get latest app release',
  downloading: 'Downloading update...',
  installReady: 'Ready to install update',
  downloadReady: 'Ready to download update',
  installedVersion: 'Installed: ',
  latestVersion: 'Latest: ',
  download: 'Download update',
  installAndRestart: 'Install update and restart',
  downloadSuccess: 'Finished downloading app update',
  databaseRetrieveError:
    'Not able to retrieve Mod Manager release from database',
  updateError: 'Error updating app',
};
