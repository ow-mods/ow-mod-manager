import React from 'react';
import fs from 'fs';

import modList from '../mod-list.json';
import Mod from './Mod';

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

const installedModFolders = fs.readdirSync(MODS_DIR);
const modManifestPaths = installedModFolders.map(folder => MODS_DIR + "/" + folder + "/manifest.json");
const manifestJsons = modManifestPaths.map(path => fs.readFileSync(path, { encoding: 'UTF-8'}));
const manifests = manifestJsons.map(json => JSON.parse(json));

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
    <h2>Installed Mods:</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Author</th>
        <th>Version</th>
      </tr>
      { manifests.map(manifest => (
        <tr>
          <td>{manifest.name}</td>
          <td>{manifest.author}</td>
          <td>{manifest.version}</td>
        </tr>
      ))}
    </table>
  </div>
);

export default App;
