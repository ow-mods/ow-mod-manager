type Mod = {
  name: string;
  author: string;
  uniqueName: string;
  folderName: string;
  localVersion?: string;
  remoteVersion?: string;
  downloadUrl?: string;
  downloadCount?: number;
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

type SortOrder = 'asc' | 'desc';
