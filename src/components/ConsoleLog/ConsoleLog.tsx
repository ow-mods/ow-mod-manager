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
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { ClearAll as ClearAllIcon } from '@material-ui/icons';

import { useOwmlLogs } from '../../hooks';
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
  modSelectHeader: {
    width: 150,
  },
  nameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
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
  const { logLines, clear } = useOwmlLogs();
  const [filteredLines, setFilteredLines] = useState<LogLine[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedModName, setSelectedModName] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [filteredLines]);

  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const isFilteringByName = filter !== '';
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
  }, [filter, logLines, selectedModName]);

  return (
    <TableContainer
      component={Paper}
      className={styles.wrapper}
      ref={containerRef}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className={styles.nameHeader}>
              <LogFilter onChange={setFilter} value={filter} />
              <Tooltip title="Clear log entries">
                <IconButton size="small" onClick={clear}>
                  <ClearAllIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell className={styles.modSelectHeader}>
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
