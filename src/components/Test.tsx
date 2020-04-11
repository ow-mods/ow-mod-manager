import * as React from 'react';
import { enable, isEnabled, disable } from '../services/mod-manager';

export class Test extends React.Component<{}, {}> {

  test() {
    console.log('test');
    const mod: Mod = {
      name: 'NomaiVR',
      author: 'Raicuparta',
      uniqueName: 'Raicuparta.NomaiVR',
      downloadUrl: 'https://github.com/Raicuparta/NomaiVR/releases/download/0.32/NomaiVR.zip',
      modPath: 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods/NomaiVR',
      localVersion: '0.0.3',
      isLoading: false,
    };
    console.log(`isEnabled? ${isEnabled(mod)}`);
    disable(mod);
    console.log(`isEnabled? ${isEnabled(mod)}`);
    enable(mod);
    console.log(`isEnabled? ${isEnabled(mod)}`);
  }

  render() {
    return <button onClick={() => this.test()}>TEST</button>
  }
}
