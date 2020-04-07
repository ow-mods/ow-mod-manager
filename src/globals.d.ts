type Manifest = {
  name: string;
  author: string;
  uniqueName: string;
  version: string;
}

type ModDbItem = {
  repo: string;
  manifest: string;
}

type Release = {
  downloadUrl: string;
  downloadCount: number;
}
