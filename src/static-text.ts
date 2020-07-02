export const logsText = {
  showingLines: (count: number) => `Showing ${count} of `,
  entries: (count: number) => `${count} entries`,
  page: (count: number) => `, page ${count}`,
  showPrevious: (count: number) => `Show previous ${count}`,
  showNext: (count: number) => `Show previous ${count}`,
  clearLogs: 'Clear log entries',
};

export const modsText = {
  selectFilter: {
    all: 'All',
    installed: 'Installed',
    enabled: 'enabled',
    notInstalled: 'notInstalled',
    outdated: 'outdated',
  },
  emptyModList: 'No mods here! 😱',
  tableHead: {
    name: 'Name',
    author: 'Author',
    downloadCount: 'Downloads',
    version: 'Version',
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
  verbose: {
    label: 'Verbose mode',
    tooltip: 'Shows more detailed info on logs',
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
      'Game path will be determined automatically when you launch the game. Only change this if automatic detection fails.',
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
    tooltip: '',
    isAdvanced: true,
  },
  disableParameterWarning: {
    label: 'Disable Steam parameter warning',
    tooltip:
      'Disables warning in the Mod Manager that warns you about the Steam warning. Yeah.',
    isAdvanced: true,
  },
  textFieldSave: 'Save',
  resetToDefault: 'Reset all settings to default',
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
};
