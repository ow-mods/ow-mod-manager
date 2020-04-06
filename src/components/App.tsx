import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import fs from 'fs';

import modList from '../mod-list.json';
import Mod from './Mod';
import Typography from '@material-ui/core/Typography';

// TODO: find correct mod directory.
const MODS_DIR = 'C:/Program Files/Epic Games/OuterWilds/OWML/Mods';

const installedMods = fs.readdirSync(MODS_DIR);

const App = () => (
  <div>
    <TableContainer>
      <Table>
        <TableHead>
        <TableRow>
            <TableCell>
              <Typography variant="h5">Available Mods:</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { modList.map(repo => (
            <TableRow>
              <TableCell>
                <Mod
                  key={repo}
                  repo={repo}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h5">Installed Mods:</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { installedMods.map(name => (
            <TableRow>
              <TableCell>{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default App;
