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

type ProgressHandler = (progress: number) => void;

type AppRelease = {
  version: string;
  downloadUrl: string;
};

type Settings = {
  closeOnPlay: boolean;
  logToSocket: boolean;
  logLinesLimit: number;
  showAdvancedSettings: boolean;
  modDatabaseUrl: string;
  openVRParameter: boolean;
  disableParameterWarning: boolean;
  owmlPath: string;
};

type OwmlSettings = {
  verbose?: boolean;
  gamePath?: string;
  combinationsBlockInput?: boolean;
};
