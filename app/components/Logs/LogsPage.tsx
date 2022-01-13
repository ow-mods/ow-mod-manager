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
  withStyles,
} from '@material-ui/core';
import { ClearAll as ClearAllIcon } from '@material-ui/icons';

import { logsText } from '../../helpers/static-text';
import { LogLine } from '../../types';
import { useSettings } from '../../hooks';
import FilterInput from '../FilterInput';
import ModNameSelect from './ModNameSelect';
import PageContainer from '../PageContainer';
import { useRecoilState } from 'recoil';
import { logLinesState } from '../../store';
import { debugConsole } from '../../helpers/console-log';

const useStyles = makeStyles(({ palette, spacing }) => ({
  Error: {
    color: palette.error.light,
  },
  Quit: {
    color: palette.error.light,
  },
  Warning: {
    color: palette.warning.light,
  },
  Success: {
    color: palette.success.light,
  },
  Info: {
    color: palette.info.light,
  },
  Fatal: {
    color: palette.error.light,
  },
  Debug: {
    color: palette.text.disabled,
  },
  Message: {},
  wrapper: {
    padding: spacing(3),
  },
  container: {
    flex: 1,
    overflowY: 'auto',
    background: palette.grey[900],
  },
  logRow: {
    border: 0,
  },
  header: {
    backgroundColor: 'white',
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

const LogCell = withStyles((theme) => ({
  body: {
    borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
  },
  stickyHeader: {
    paddingTop: theme.spacing(1),
    background: theme.palette.background.paper,
  },
}))(TableCell);

const OwmlLog: React.FunctionComponent = () => {
  const styles = useStyles();
  const [logLines, setLogLines] = useRecoilState(logLinesState);
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
    debugConsole.log('useEffect: LogsPage scroll reset');
    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [paginatedLines]);

  useEffect(() => {
    debugConsole.log('useEffect: LogsPage filter');
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
    debugConsole.log('useEffect: LogsPage pagination reset');
    setPage(0);
  }, [filter, selectedModName]);

  function handlePreviousPageClick() {
    setPage((prevPage) => prevPage + 1);
  }

  function handleNextPageClick() {
    setPage((prevPage) => prevPage - 1);
  }

  function handleClearClick() {
    setLogLines([]);
  }

  return (
    <PageContainer maxWidth={false}>
      <TableContainer
        component={Paper}
        className={styles.container}
        ref={containerRef}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <LogCell className={styles.nameHeader}>
                <FilterInput
                  onChange={setFilter}
                  value={filter}
                  label={logsText.filterLogsLabel}
                />
                {logLines.length > 1 && (
                  <Typography variant="subtitle2" color="textSecondary">
                    {hasHiddenLines.current &&
                      logsText.showingLines(paginatedLines.length)}
                    {logsText.entries(logLines.length)}
                    {isPaginated.current && logsText.page(page + 1)}
                  </Typography>
                )}
                <Tooltip title={logsText.clearLogs}>
                  <IconButton size="small" onClick={handleClearClick}>
                    <ClearAllIcon />
                  </IconButton>
                </Tooltip>
              </LogCell>
              <LogCell className={styles.modSelectHeader}>
                <ModNameSelect
                  value={selectedModName}
                  onChange={setSelectedModName}
                  logLines={logLines}
                />
              </LogCell>
              <LogCell className={styles.logCountHeader}>#</LogCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPreviousPageVisible.current && (
              <TableRow>
                <LogCell colSpan={3}>
                  <Button
                    onClick={handlePreviousPageClick}
                    fullWidth
                    variant="outlined"
                  >
                    {logsText.showPrevious(logLinesLimit)}
                  </Button>
                </LogCell>
              </TableRow>
            )}
            {paginatedLines.map((line: LogLine) => (
              <React.Fragment key={line.id}>
                <TableRow>
                  <LogCell className={styles[line.type]}>
                    {line.text.split('\n').map((text) => (
                      <div>{text}</div>
                    ))}
                  </LogCell>
                  <LogCell className={styles.modNameCell}>
                    {line.modName}
                  </LogCell>
                  <LogCell>{line.count > 1 ? line.count : ''}</LogCell>
                </TableRow>
              </React.Fragment>
            ))}
            {isNextPageVisible && (
              <TableRow>
                <LogCell colSpan={3}>
                  <Button
                    onClick={handleNextPageClick}
                    fullWidth
                    variant="outlined"
                  >
                    {logsText.showNext(logLinesLimit)}
                  </Button>
                </LogCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default OwmlLog;
