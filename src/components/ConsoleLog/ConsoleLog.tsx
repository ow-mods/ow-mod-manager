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
} from '@material-ui/core';

import { useOwmlLogs } from '../../hooks/use-owml-logs';
import useDebouncedState from '../../hooks/use-debounced-state';
import LogFilter from './LogFilter';
import ModNameSelect from './ModNameSelect';

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
  modNameCell: {
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logCountHeader: {
    width: 1,
  },
}));

const OwmlLog: React.FunctionComponent = () => {
  const styles = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const { logLines } = useOwmlLogs();
  const [filteredLines, setFilteredLines] = useState<LogLine[]>([]);
  const [filter, debouncedFilter, setFilter] = useDebouncedState('', 300);
  const [selectedModName, setSelectedModName] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [logLines]);

  useEffect(() => {
    const lowerCaseFilter = debouncedFilter.toLowerCase();
    const isFilteringByName = debouncedFilter !== '';
    const isFilteringByMod = selectedModName !== '';

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

  return (
    <TableContainer
      component={Paper}
      className={styles.wrapper}
      ref={containerRef}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <LogFilter onChange={setFilter} value={filter} />
            </TableCell>
            <TableCell className={styles.modNameHeader}>
              <ModNameSelect
                value={selectedModName}
                onChange={setSelectedModName}
                logLines={logLines}
              />
            </TableCell>
            <TableCell className={styles.logCountHeader}>#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLines.map((line: LogLine) => (
            <React.Fragment key={line.id}>
              <TableRow>
                <TableCell className={styles[line.type]}>{line.text}</TableCell>
                <TableCell className={styles.modNameCell}>
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
