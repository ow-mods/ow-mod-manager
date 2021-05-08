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

type Props = {
  title: string;
};

const ModTableHead: React.FunctionComponent<Props> = ({ title }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        {title}
      </TableCell>
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
