import React, { useEffect, useRef } from 'react';
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
} from '@material-ui/core';

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

  useEffect(() => {
    container.current.scrollTo(0, container.current.scrollHeight);
  }, [logLines]);

  return (
    <TableContainer
      component={Paper}
      className={styles.wrapper}
      ref={container}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell>Mod</TableCell>
            <TableCell>#</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logLines.map((line: LogLine) => (
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
