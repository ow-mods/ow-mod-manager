import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { modsText } from '../../static-text';

type Props = {
  title: string;
};

const ModTableHead: React.FunctionComponent<Props> = ({ title }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        {title}
      </TableCell>
      <TableCell width="100px">
        {modsText.tableHead.downloadCount}
      </TableCell>
      <TableCell width="110px" align="center">
        {modsText.tableHead.version}
      </TableCell>
      <TableCell width="200px" />
    </TableRow>
  </TableHead>
);

export default ModTableHead;
