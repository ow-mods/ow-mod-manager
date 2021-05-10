export const globalText = {
  tabs: {
    mods: 'Mods',
    logs: 'Logs',
    settings: 'Settings',
    update: 'Update',
  },
  startGame: 'Start Game',
  gameRunning: 'Already running',
  missingRequiredMod: (modNames: string[]) =>
    `Please install ${modNames.join(', ')} before starting the game`,
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
  selectFilter: {
    all: 'All mods',
    installed: 'Installed',
    enabled: 'Enabled',
    notInstalled: 'Not Installed',
    outdated: 'Outdated',
  },
  findModsLabel: 'Find mods',
  emptyModList: 'No mods here! 😱',
  tableHead: {
    author: 'Author',
    downloadCount: 'Downloads',
    version: 'Version',
    actions: '',
  },
  modSections: {
    required: 'Required mods',
    installed: 'Installed mods',
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
    update: (version: string) => `Update to ${version}`,
    alreadyInstalled: 'Already installed',
    install: 'Install',
    more: 'More...',
    openDirectory: 'Show in explorer',
    openRepo: 'More info on GitHub',
    uninstall: 'Uninstall',
    installPrerelease: (version: string) => `Install Prerelease (${version})`,
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
  missingDependencyWarning: (modName: string, dependencyNames: string) =>
    `${modName} requires ${dependencyNames}`,
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
  disableModWarnings: {
    label: 'Disable warning for mod',
    tooltip:
      'Prevents this mod from showing warnings in the Mod Manager when starting the game',
  },
  textFieldSave: 'Save',
  pathFindButton: 'Find...',
  pathFindTitle: (fileName: string) => `Find ${fileName}...`,
  resetToDefault: 'Reset all settings to default',
  getSettingsError: (path: string) =>
    `Error while getting settings file in ${path}: `,
  setInvalidSettingsError: 'Trying to set invalid settings',
  setInvalidOwmlSettingsError: 'Trying to set invalid OWML settings',
  steamParamsWarning: {
    message: 'Steam might show a warning before starting the game',
    detail: (paramNames: string[]) => `You enabled "${paramNames.join(
      '" and "'
    )}".

If you own the Steam version of the game, Steam might show a warning about custom parameters.

The warning might not be visible until you open a Steam window.

If you have SteamVR running, the warning might only be visible while you're using your VR headset.

If you want Steam to stop bothering you about this, you'll have to disable these options in the Mod Manager settings.`,
  },
};

export const updateText = {
  dialogYes: 'Restart app and update',
  dialogNo: 'Not now, update later',
  dialogTitle: 'Outer Wilds Mod Manager',
  dialogMessage: 'Update available',
  dialogDetail: (version: string) =>
    `An update is available for version ${version} of the Mod Manager.`,
};
