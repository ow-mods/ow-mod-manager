import semver from 'semver';
import unzip from 'unzipper';
import request from 'request';
import fs from 'fs-extra';
import path from 'path';
import config from '../config.json';

export class ModManager {
  private mod: Mod;

  constructor(mod: Mod) {
    this.mod = mod;
  }

  get isInstalled(): boolean {
    return !!this.mod.localVersion;
  }

  get isOutdated(): boolean {
    return this.isInstalled
            && this.mod.remoteVersion !== undefined
            && this.mod.localVersion !== undefined
            && semver.lt(this.mod.localVersion, this.mod.remoteVersion);
  }

  get modFolder(): string {
    return `${config.owmlPath}/Mods/${this.mod.name}`;
  }

  public async install() {
    if (this.isInstalled) {
      throw new Error("Can't install mod because it's already installed");
    }
    await this.upstall();
  }

  public async update() {
    if (!this.isOutdated) {
      throw new Error("Can't update mod because it's not out of date");
    }
    await this.upstall();
  }

  public async uninstall() {
    if (!this.isInstalled) {
      throw new Error("Can't uninstall mod because it's not installed");
    }
    await this.deleteFolder(this.modFolder);
  }

  private async upstall() {
    if (!this.mod.downloadUrl) {
      return;
    }

    const temporaryPath = `temp/${this.mod.name}-${new Date().getTime()}`;
    const zipPath = `${temporaryPath}/${this.mod.name}.zip`;
    const unzipPath = `${temporaryPath}/${this.mod.name}`;

    await this.createFolders(unzipPath);
    await this.downloadFile(this.mod.downloadUrl, zipPath);
    await this.unzip(zipPath, unzipPath);
    await this.copyFolder(unzipPath, this.modFolder);
    await this.deleteFolder(temporaryPath);
  }

  private async createFolders(dir: string) {
    await fs.mkdirs(dir);
  }

  private async downloadFile(url: string, filePath: string) {
    const writer = fs.createWriteStream(filePath);
    request(url).pipe(writer);
    return new Promise((resolve) => {
      writer.on('finish', resolve);
    });
  }

  private async unzip(zipPath: string, unzipPath: string) {
    const absUnzipPath = path.resolve(unzipPath);
    const extract = unzip.Extract({ path: absUnzipPath });
    const reader = fs.createReadStream(zipPath);
    reader.pipe(extract);
    return new Promise((resolve) => {
      extract.on('close', resolve);
    });
  }

  private async copyFolder(sourcePath: string, targetPath: string) {
    await fs.copy(sourcePath, targetPath, {
      errorOnExist: false,
      overwrite: true,
      recursive: true,
    });
  }

  private async deleteFolder(folderPath: string) {
    await fs.remove(folderPath);
  }
}
