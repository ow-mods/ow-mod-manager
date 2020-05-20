import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

interface Props {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Mod,
  ) => void;
  order: SortOrder;
  orderBy: string;
}

type HeadCell = {
  disablePadding: boolean;
  id: keyof Mod;
  label: string;
  numeric: boolean;
};

const headCells: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: false,
    label: 'Author',
  },
  {
    id: 'downloadCount',
    numeric: true,
    disablePadding: false,
    label: 'Downloads',
  },
];

function ModTableHead(props: Props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Mod) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Version</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

export default ModTableHead;
