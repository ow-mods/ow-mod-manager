import { Manifest } from "./manifest";
import { Release } from "./release";

export class Mod {
  localManifest?: Manifest;
  remoteManifest?: Manifest;
  release?: Release;

  get manifest(): Manifest {
    return this.localManifest || this.remoteManifest;
  }

  get isInstalled(): boolean {
    return this.localManifest != null;
  }

  get isOutdated(): boolean {
    return this.localManifest != null &&
           this.remoteManifest != null &&
           this.localManifest.version < this.remoteManifest.version;
  }
}
