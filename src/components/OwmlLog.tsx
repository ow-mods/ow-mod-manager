import React, { useEffect, useRef, useState } from 'react';
import { useOwmlLogs } from '../hooks/use-owml-logs';
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
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
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
}));

const OwmlLog: React.FunctionComponent = () => {
  const styles = useStyles();
  const { logLines } = useOwmlLogs();
  const container = useRef<HTMLDivElement>(null);
  const [filteredLines, setFilteredLines] = useState<LogLine[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    container.current.scrollTo(0, container.current.scrollHeight);
  }, [logLines]);

  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    setFilteredLines(
      logLines.filter(
        (line) =>
          line.text.toLowerCase().includes(lowerCaseFilter) ||
          line.modName.toLowerCase().includes(lowerCaseFilter),
      ),
    );
  }, [filter, logLines]);

  const handleFilterChange = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(currentTarget.value);
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
              <Input
                onChange={handleFilterChange}
                value={filter}
                placeholder="Filter by message or mod name"
                color="secondary"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLines.map((line: LogLine) => (
            <React.Fragment key={line.id}>
              <TableRow>
                <TableCell className={styles[line.type]}>{line.text}</TableCell>
                <TableCell>{line.modName}</TableCell>
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
