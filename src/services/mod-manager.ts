import semver from 'semver'

export class ModManager {

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
        // download zip from mod.downloadUrl
        // unzip to Mods folder
    }

    async update(): Promise<void> {
        if (!this.isOutdated) {
            throw "Not outdated";
        }
        // same as install, but unzip into existing mod folder and overwrite files
    }

    async delete(): Promise<void> {
        if (!this.isInstalled) {
            throw "Not installed";
        }
        // delete mod folder
    }

}