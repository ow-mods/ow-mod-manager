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
        return this.mod.localVersion != null &&
            this.mod.remoteVersion != null &&
            semver.lt(this.mod.localVersion, this.mod.remoteVersion);
    }

    update(): boolean {
        if (!this.isInstalled || !this.isOutdated ) {
            return false;
        }
        // todo
        return true;
    }

    install(): boolean {
        if (this.isInstalled) {
            return false;
        }
        // todo
        return true;
    }

    uninstall(): boolean {
        if (!this.isInstalled) {
            return false;
        }
        // todo
        return true;
    }

}