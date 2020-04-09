import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface Props {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Mod) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: SortOrder;
  orderBy: string;
  rowCount: number;
}

type HeadCell = {
  disablePadding: boolean;
  id: keyof Mod;
  label: string;
  numeric: boolean;
};

const headCells: HeadCell[] = [
  {
    id: 'name', numeric: false, disablePadding: true, label: 'Name',
  },
  {
    id: 'author', numeric: false, disablePadding: false, label: 'Author',
  },
  {
    id: 'localVersion', numeric: false, disablePadding: false, label: 'Local Version',
  },
  {
    id: 'remoteVersion', numeric: false, disablePadding: false, label: 'Remote Version',
  },
  {
    id: 'downloadCount', numeric: true, disablePadding: false, label: 'Downloads',
  },
];

function ModTableHead(props: Props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Mod) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
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
      </TableRow>
    </TableHead>
  );
}

export default ModTableHead;
