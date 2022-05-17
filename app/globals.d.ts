/// <reference types="react-dom/experimental" />
/// <reference types="react/experimental" />

type Warning = {
  title?: string;
  body?: string;
};

type Mod = {
  name: string;
  author: string;
  uniqueName: string;
  parent?: string;
  modPath: string;
  localVersion?: string;
  remoteVersion?: string;
  downloadUrl?: string;
  downloadCount?: number;
  repo?: string;
  isEnabled?: boolean;
  isRequired?: boolean;
  errors: string[];
  dependencies: string[];
  description?: string;
  prerelease?: {
    downloadUrl: string;
    version: string;
  };
  warning?: Warning;
  patcher?: string;
  conflicts?: string[];
  pathsToPreserve?: string[];
  addons: string[];
};

type ModManager = {
  downloadCount: number;
};

type ModMap = { [uniqueName: string]: Mod };

type Manifest = {
  name: string;
  author: string;
  uniqueName: string;
  version: string;
  dependencies?: string[];
  warning?: Warning;
  patcher?: string;
  conflicts?: string[];
  pathsToPreserve?: string[];
};

type ModConfig = {
  enabled: boolean;
};

type SortOrder = 'asc' | 'desc';

type HeadCellID = 'name' | 'author' | 'version' | 'downloadCount';

type ProgressHandler = (progress: number) => void;

type Settings = {
  closeOnPlay: boolean;
  logToSocket: boolean;
  logLinesLimit: number;
  showAdvancedSettings: boolean;
  modDatabaseUrl: string;
  alertSourceUrl: string;
  owmlPath: string;
  disableModWarnings: Record<string, boolean>;
};

type OwmlSettings = {
  gamePath?: string;
  debugMode?: boolean;
  forceExe?: boolean;
};
