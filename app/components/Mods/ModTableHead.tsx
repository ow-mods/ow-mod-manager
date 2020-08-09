import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { modsText } from '../../static-text';

type HeadCell = {
  disablePadding: boolean;
  id: keyof typeof modsText.tableHead;
  numeric: boolean;
  width?: string;
};

const headCells: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: false,
    width: '20%',
  },
  {
    id: 'downloadCount',
    numeric: true,
    disablePadding: false,
    width: '100px',
  },
  {
    id: 'version',
    numeric: false,
    disablePadding: false,
    width: '120px',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    width: '200px',
  },
];

const ModTableHead: React.FunctionComponent = () => (
  <TableHead>
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.numeric ? 'right' : 'left'}
          padding={headCell.disablePadding ? 'none' : 'default'}
          width={headCell.width}
        >
          {modsText.tableHead[headCell.id]}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default ModTableHead;
