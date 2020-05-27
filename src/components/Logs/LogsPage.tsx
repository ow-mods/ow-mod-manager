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

import { useOwmlLogs, useSettings } from '../../hooks';
import FilterInput from '../FilterInput';
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
  info: {},
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
  const { logLines, clear } = useOwmlLogs();
  const {
    settings: { logLinesLimit },
  } = useSettings();

  const [paginatedLines, setPaginatedLines] = useState<LogLine[]>([]);
  const [selectedModName, setSelectedModName] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPreviousPageVisible = useRef(false);
  const isNextPageVisible = page > 0;
  const isPaginated = useRef(false);
  const hasHiddenLines = useRef(false);

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

    let filteredLines: LogLine[] = [];
    if (isFilteringByName || isFilteringByMod) {
      filteredLines = logLines.filter((line) => {
        const isFromSelectedMod =
          !isFilteringByMod || line.modName === selectedModName;
        const isMatchWithFilter =
          !isFilteringByName ||
          line.text.toLowerCase().includes(lowerCaseFilter);
        return isMatchWithFilter && isFromSelectedMod;
      });
    } else {
      filteredLines = logLines;
    }

    let lines: LogLine[] = [];
    if (filteredLines.length <= logLinesLimit) {
      lines = filteredLines;
    }

    const end = filteredLines.length - page * logLinesLimit;
    const start = end > logLinesLimit ? end - logLinesLimit : 0;
    lines = filteredLines.slice(start, end);

    isPreviousPageVisible.current =
      page < Math.floor((filteredLines.length - 1) / logLinesLimit);
    isPaginated.current = filteredLines.length !== lines.length;
    hasHiddenLines.current = logLines.length !== lines.length;

    setPaginatedLines(lines);
  }, [filter, logLines, selectedModName, page, logLinesLimit]);

  useEffect(() => {
    setPage(0);
  }, [filter, selectedModName]);

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
              <FilterInput onChange={setFilter} value={filter} />
              {logLines.length > 1 && (
                <Typography variant="subtitle2" color="textSecondary">
                  {hasHiddenLines.current &&
                    `Showing ${paginatedLines.length} of `}
                  {logLines.length} entries
                  {isPaginated.current && `, page ${page + 1}`}
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
          {isPreviousPageVisible.current && (
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
