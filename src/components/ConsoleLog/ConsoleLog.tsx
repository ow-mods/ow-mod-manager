import React, { useEffect, useRef, useState } from 'react';
import {
  makeStyles,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Input,
  InputAdornment,
  Select,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import { Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons';
import { uniq } from 'lodash';

import { useOwmlLogs } from '../../hooks/use-owml-logs';
import useDebounce from '../../hooks/use-debounce';
import useDebouncedState from '../../hooks/use-debounced-state';
import LogFilter from './LogFilter';

const useStyles = makeStyles(({ palette, mixins, spacing }) => ({
  error: {
    color: palette.error.light,
  },
  warning: {
    color: palette.warning.light,
  },
  success: {
    color: palette.success.light,
  },
  log: {},
  wrapper: {
    maxHeight: `calc(100vh - ${mixins.toolbar.minHeight}px - ${
      spacing(2) * 2
    }px)`,
    overflowY: 'auto',
  },
  modNameHeader: {
    width: 200,
  },
  modNameText: {
    maxWidth: 200,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logCountHeader: {
    width: 1,
  },
}));

const ALL_MODS = 'all';

const OwmlLog: React.FunctionComponent = () => {
  const styles = useStyles();
  const { logLines } = useOwmlLogs();
  const container = useRef<HTMLDivElement>(null);
  const [filteredLines, setFilteredLines] = useState<LogLine[]>([]);
  const [filter, debouncedFilter, setFilter] = useDebouncedState('', 300);
  const [modNames, setModNames] = useState<string[]>([]);
  const [selectedModName, setSelectedModName] = useState<string>(ALL_MODS);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    container.current.scrollTo(0, container.current.scrollHeight);
  }, [logLines]);

  useEffect(() => {
    const lowerCaseFilter = debouncedFilter.toLowerCase();
    const isFilteringByName = debouncedFilter !== '';
    const isFilteringByMod = selectedModName !== ALL_MODS;

    if (isFilteringByName || isFilteringByMod) {
      setFilteredLines(
        logLines.filter((line) => {
          const isFromSelectedMod =
            !isFilteringByMod || line.modName === selectedModName;
          const isMatchWithFilter =
            !isFilteringByName ||
            line.text.toLowerCase().includes(lowerCaseFilter);
          return isMatchWithFilter && isFromSelectedMod;
        }),
      );
    } else {
      setFilteredLines(logLines);
    }
  }, [debouncedFilter, logLines, selectedModName]);

  useEffect(() => {
    setModNames(uniq(logLines.map((line) => line.modName)));
  }, [logLines]);

  const handleFilterChange = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(currentTarget.value);
  };

  const handleModNameChange = ({
    target,
  }: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    console.log('target', target.value);
    setSelectedModName(target.value as string);
  };

  return (
    <TableContainer
      component={Paper}
      className={styles.wrapper}
      ref={container}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <LogFilter onChange={setFilter} value={filter} />
            </TableCell>
            <TableCell className={styles.modNameHeader}>
              <Select
                className={styles.modNameText}
                value={selectedModName}
                onChange={handleModNameChange}
              >
                <MenuItem value={ALL_MODS}>All mods</MenuItem>
                {modNames.map((modName) => (
                  <MenuItem value={modName} key={modName}>
                    {modName}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell className={styles.logCountHeader}>#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLines.map((line: LogLine) => (
            <React.Fragment key={line.id}>
              <TableRow>
                <TableCell className={styles[line.type]}>{line.text}</TableCell>
                <TableCell className={styles.modNameText}>
                  {line.modName}
                </TableCell>
                <TableCell>{line.count > 1 ? line.count : ''}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OwmlLog;
