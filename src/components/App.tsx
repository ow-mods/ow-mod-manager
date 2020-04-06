import React from 'react';
import fs from 'fs';

import modList from '../mod-list.json';
import Mod from './Mod';

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

const installedMods = fs.readdirSync(MODS_DIR);

const App = () => (
  <div>
    <h2>Available Mods:</h2>
    <table>
      { modList.map(repo => (
        <tr>
          <td>
            <Mod
              key={repo}
              repo={repo}
            />
          </td>
        </tr>
      ))}
    </table>
    <h2>Instaled Mods:</h2>
    <table>
      { installedMods.map(name => (
        <tr>
          <td>{name}</td>
        </tr>
      ))}
    </table>
  </div>
);

export default App;
