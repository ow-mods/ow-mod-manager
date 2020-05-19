import React from 'react';
import {
  TableContainer,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  Paper,
} from '@material-ui/core';

import ModTableHead from './ModTableHead';
import { useAppState } from '../../hooks';
import ModTableRow from './ModTableRow';
import ModToolbar from './ModToolbar';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Mod>(
  order: SortOrder,
  orderBy: Key,
): (a: Mod, b: Mod) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map(
    (element, index) => [element, index] as [T, number],
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((element) => element[0]);
}

type Props = {
  filter?: (mod: Mod) => boolean;
};

const ModTable: React.FunctionComponent<Props> = ({ filter }) => {
  const [order, setOrder] = React.useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Mod>('downloadCount');
  const { modMap } = useAppState();

  const rows = Object.values(modMap);
  const filteredRows = filter ? rows.filter(filter) : rows;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Mod,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (filteredRows.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography>No mods here! 😱</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableContainer component={Paper}>
      <ModToolbar />
      <Table size="small">
        <ModTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort(filteredRows, getComparator(order, orderBy)).map(
            (mod: Mod) => (
              <ModTableRow mod={mod} key={mod.uniqueName} />
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ModTable;
