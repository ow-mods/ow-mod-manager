import semver from 'semver'
import unzip from 'unzipper';
import axios from 'axios';
import fs from 'fs-extra';

export class ModManager {

    // TODO: find correct mod directory.
    private MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

    private mod: Mod;

    constructor(mod: Mod) {
        this.mod = mod;
    }

    get isInstalled(): boolean {
        return !!this.mod.localVersion;
    }

    get isOutdated(): boolean {
        return this.isInstalled &&
            this.mod.remoteVersion &&
            semver.lt(this.mod.localVersion, this.mod.remoteVersion);
    }

    get modFolder(): string {
        return `${this.MODS_DIR}/${this.mod.name}`;
    }

    public async install() {
        if (this.isInstalled) {
            throw "Can't install mod because it's already installed";
        }
        await this.upstall();
    }

    public async update() {
        if (!this.isOutdated) {
            throw "Can't update mod because it's not out of date";
        }
        await this.upstall();
    }

    public async uninstall() {
        if (!this.isInstalled) {
            throw "Can't uninstall mod because it's not installed";
        }
        await this.deleteFolder(this.modFolder);
    }

    private async upstall() {
        const tempPath = `temp/${this.mod.name}-${Date.now}`;
        const zipPath = `${tempPath}/${this.mod.name}.zip`
        const unzipPath = `${tempPath}/${this.mod.name}`

        await this.downloadFile(this.mod.downloadUrl, zipPath);
        await this.unzip(zipPath, unzipPath);
        await this.copyFolder(unzipPath, this.modFolder);
        await this.deleteFolder(tempPath);
    }

    private async downloadFile(url: string, path: string) {
        var writeStream = fs.createWriteStream(path);
        axios({
            url,
            method: 'get',
            responseType: "stream"
        }).then(response => {
            response.data.pipe(writeStream);
        });
        await new Promise(resolve => {
            writeStream.on('finish', resolve);
        });
    }

    private async unzip(zipPath: string, unzipPath: string) {
        const extract = unzip.Extract({ path: unzipPath });
        fs.createReadStream(zipPath)
            .pipe(extract);
        await new Promise(resolve => {
            extract.on('close', resolve);
        });
    }

    private async copyFolder(sourcePath: string, targetPath: string) {
        await fs.copy(sourcePath, targetPath, {
            errorOnExist: false,
            overwrite: true,
            recursive: true
        });
    }

    private async deleteFolder(folderPath: string) {
        await fs.remove(folderPath);
    }

}
