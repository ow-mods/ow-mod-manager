import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  Toolbar,
  makeStyles,
  Select,
  MenuItem,
  TableRow,
  TableCell,
} from '@material-ui/core';

import { modsText } from '../../static-text';
import { isInstalled, isOutdated } from '../../services';
import ModTableHead from './ModTableHead';
import { useAppState } from '../../hooks';
import ModTableRow from './ModTableRow';
import FilterInput from '../FilterInput';

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

const useStyles = makeStyles({
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

enum SelectFilter {
  All = 'all',
  Installed = 'installed',
  Enabled = 'enabled',
  NotInstalled = 'notInstalled',
  Outdated = 'outdated',
}

const filterByText = (filter: string, mod: Mod) => {
  const lowerCaseFilter = filter.toLowerCase();
  const nameMatch = mod.name.toLowerCase().includes(lowerCaseFilter);
  const authorNatch = mod.author.toLowerCase().includes(lowerCaseFilter);
  const uniqueNameMatch = mod.uniqueName
    .toLowerCase()
    .includes(lowerCaseFilter);

  return nameMatch || authorNatch || uniqueNameMatch;
};

const filterBySelect = (filter: SelectFilter, mod: Mod) => {
  if (filter === SelectFilter.Installed) {
    return isInstalled(mod);
  }
  if (filter === SelectFilter.NotInstalled) {
    return !isInstalled(mod);
  }
  if (filter === SelectFilter.Enabled) {
    return mod.isEnabled;
  }
  if (filter === SelectFilter.Outdated) {
    return isOutdated(mod);
  }
  return true;
};

const ModTable: React.FunctionComponent = () => {
  const styles = useStyles();
  const [order, setOrder] = useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = useState<keyof Mod>('downloadCount');
  const { modMap } = useAppState();
  const [filter, setFilter] = useState('');
  const [selectFilter, setSelectFilter] = useState(SelectFilter.All);
  const [modRows, setModRows] = useState<Mod[]>([]);

  useEffect(() => {
    const filteredRows = Object.values(modMap).filter((mod) => {
      return filterByText(filter, mod) && filterBySelect(selectFilter, mod);
    });

    setModRows(filteredRows);
  }, [filter, selectFilter, modMap]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Mod,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectFilterChange = ({
    target,
  }: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    setSelectFilter(target.value as SelectFilter);
  };

  return (
    <TableContainer component={Paper}>
      <Toolbar variant="dense" className={styles.toolBar}>
        <FilterInput value={filter} onChange={setFilter} />
        <div>
          <Select
            value={selectFilter}
            onChange={handleSelectFilterChange}
            color="secondary"
          >
            {Object.values(SelectFilter).map((value) => (
              <MenuItem key={value} value={value}>
                {modsText.selectFilter[value]}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Toolbar>
      <Table size="small">
        <ModTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {modRows.length === 0 && (
            <TableRow>
              <TableCell>{modsText.emptyModList}</TableCell>
            </TableRow>
          )}
          {modRows.length > 0 &&
            stableSort(
              modRows,
              getComparator(order, orderBy),
            ).map((mod: Mod) => <ModTableRow mod={mod} key={mod.uniqueName} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ModTable;
