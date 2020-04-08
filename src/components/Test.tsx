import * as React from "react";
import { ModManager } from "../services/mod-manager";

type Props = {
    // name: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Test extends React.Component<Props, {}> {

    test() {
        console.log("test");
        const mod: Mod = {
            name: "NomaiVR",
            author: "Raicuparta",
            uniqueName: "Raicuparta.NomaiVR",
            downloadUrl: "https://github.com/Raicuparta/NomaiVR/releases/download/0.32/NomaiVR.zip",
            // localVersion: "0.1",
            remoteVersion: "0.2"            
        };
        const modManager = new ModManager(mod);
        modManager.install();
    }

    render() {
        return <button onClick={() => this.test()}>TEST</button>
    }
}