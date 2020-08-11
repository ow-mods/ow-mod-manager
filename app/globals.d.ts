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
  dependencies: string[];
  requireVR?: boolean;
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
  dependencies?: string[];
  requireVR?: boolean;
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
  openVRParameter: boolean;
  disableParameterWarning: boolean;
  owmlPath: string;
};

type OwmlSettings = {
  gamePath?: string;
  combinationsBlockInput?: boolean;
};
