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
