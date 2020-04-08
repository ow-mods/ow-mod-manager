import semver from 'semver'
import unzip from 'unzip';
import axios from 'axios';
import fs from 'fs';

export class ModManager {

    // TODO: find correct mod directory.
    private MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

    private mod: Mod;

    constructor(mod: Mod) {
        this.mod = mod;
    }

    get isInstalled(): boolean {
        return this.mod.localVersion != null;
    }

    get isOutdated(): boolean {
        return this.isInstalled &&
            this.mod.remoteVersion != null &&
            semver.lt(this.mod.localVersion, this.mod.remoteVersion);
    }

    async install(): Promise<void> {
        if (this.isInstalled) {
            throw "Already installed";
        }
        const modFolder = `${this.MODS_DIR}/${this.mod.name}`;
        await this.downloadAndUnzip(this.mod.downloadUrl, modFolder);
    }

    async update(): Promise<void> {
        if (!this.isOutdated) {
            throw "Not outdated";
        }
        this.install(); // i guess?
    }

    async delete(): Promise<void> {
        if (!this.isInstalled) {
            throw "Not installed";
        }
        // todo: delete mod folder
    }

    private async downloadAndUnzip(url: string, path: string): Promise<void> {
        var writeStream = fs.createWriteStream(path);
        axios({
            url,
            method: 'get',
            responseType: "stream"
        }).then(response => {
            response.data
                .pipe(unzip.Parse())
                .pipe(writeStream);
        });
        return new Promise(resolve => {
            writeStream.on('finish', resolve);
        });
    }

}