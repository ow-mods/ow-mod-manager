import { hot } from 'react-hot-loader/root';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import modList from '../mod-list.json';
import ModItem from './ModItem';
import ModList from './ModList';

const App = () => (
  <div>
    <ModList />
  </div>
)

export default hot(App);
