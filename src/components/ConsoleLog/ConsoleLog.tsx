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
  Typography,
  Button,
} from '@material-ui/core';
import { ClearAll as ClearAllIcon } from '@material-ui/icons';

import { logLinesLimit } from '../../config.json';
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
    alignItems: 'center',
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
  const [paginatedLines, setPaginatedLines] = useState<LogLine[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedModName, setSelectedModName] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const isNextPageVisible = page > 0;
  const isPreviousPageVisible =
    page < Math.floor((filteredLines.length - 1) / logLinesLimit);
  const isPaginated = filteredLines.length !== paginatedLines.length;
  const hasHiddenLines = logLines.length !== paginatedLines.length;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [paginatedLines]);

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
  }, [filter, logLines, selectedModName, page]);

  useEffect(() => {
    if (filteredLines.length <= logLinesLimit) {
      setPaginatedLines(filteredLines);
    }

    const end = filteredLines.length - page * logLinesLimit;
    const start = end > logLinesLimit ? end - logLinesLimit : 0;
    setPaginatedLines(filteredLines.slice(start, end));
  }, [filteredLines, page]);

  function handlePreviousPageClick() {
    setPage((prevPage) => prevPage + 1);
  }

  function handleNextPageClick() {
    setPage((prevPage) => prevPage - 1);
  }

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
              {logLines.length > 1 && (
                <Typography variant="subtitle2" color="textSecondary">
                  {hasHiddenLines && `Showing ${paginatedLines.length} of `}
                  {logLines.length} entries
                  {isPaginated && `, page ${page + 1}`}
                </Typography>
              )}
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
          {isPreviousPageVisible && (
            <TableRow>
              <TableCell colSpan={3}>
                <Button
                  onClick={handlePreviousPageClick}
                  fullWidth
                  variant="outlined"
                >
                  Show previous {logLinesLimit}
                </Button>
              </TableCell>
            </TableRow>
          )}
          {paginatedLines.map((line: LogLine) => (
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
          {isNextPageVisible && (
            <TableRow>
              <TableCell colSpan={3}>
                <Button
                  onClick={handleNextPageClick}
                  fullWidth
                  variant="outlined"
                >
                  Show next {logLinesLimit}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OwmlLog;
