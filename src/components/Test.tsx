import * as React from "react";
import runOwml from "../services/run-owml";

export class Test extends React.Component<{}, {}> {

    test() {
        runOwml();
    }

    render() {
        return <button onClick={() => this.test()}>TEST</button>
    }
}