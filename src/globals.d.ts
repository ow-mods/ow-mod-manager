/// <reference types="react-dom/experimental" />
/// <reference types="react/experimental" />

type Mod = {
  name: string;
  author: string;
  uniqueName: string;
  modPath: string;
  localVersion?: string;
  remoteVersion?: string;
  downloadUrl?: string;
  downloadCount?: number;
  repo?: string;
  isEnabled?: boolean;
  isRequired?: boolean;
  errors: string[];
};

type ModMap = { [uniqueName: string]: Mod };

type ModDbItem = {
  repo: string;
  manifest: string;
};

type Release = {
  downloadUrl: string;
  downloadCount: number;
};

type Manifest = {
  name: string;
  author: string;
  uniqueName: string;
  version: string;
};

type ModConfig = {
  enabled: boolean;
};

type SortOrder = 'asc' | 'desc';

type HeadCellID = 'name' | 'author' | 'version' | 'downloadCount';

type LogType = 'error' | 'warning' | 'info' | 'success';

type LogLine = {
  modName: string;
  text: string;
  type: LogType;
  count: number;
  id: number;
};

type ProgressHandler = (progress: number) => void;

type Settings = {
  closeOnPlay: boolean;
  logToSocket: boolean;
  logLinesLimit: number;
  showAdvancedSettings: boolean;
  modDatabaseUrl: string;
};

type AppRelease = {
  version: string;
  downloadUrl: string;
};
