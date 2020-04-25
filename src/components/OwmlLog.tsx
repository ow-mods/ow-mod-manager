import React, { useEffect } from 'react';
import { useOwmlLogs } from '../hooks/use-owml-logs';
import {
  Card,
  makeStyles,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
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
  logsTable: {
    maxHeight: `calc(100vh - ${mixins.toolbar.minHeight}px - ${
      spacing(2) * 2
    }px)`,
    overflowY: 'auto',
  },
}));

const OwmlLog: React.FunctionComponent = () => {
  const styles = useStyles();
  const { logLines } = useOwmlLogs();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [logLines]);

  return (
    <Card className={styles.logsTable}>
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
    </Card>
  );
};

export default OwmlLog;
