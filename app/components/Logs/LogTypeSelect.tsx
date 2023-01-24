import React, { useEffect, useState } from 'react';
import { makeStyles, Select, MenuItem } from '@material-ui/core';
import { uniq } from 'lodash';

import { logsText } from '../../helpers/static-text';
import { LogLine, LogType } from '../../types';
import { debugConsole } from '../../helpers/console-log';

const useStyles = makeStyles({
  root: {
    maxWidth: 150,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

type Props = {
  value: string;
  onChange: (value: string) => void;
  logLines: LogLine[];
};

const LogTypeSelect: React.FunctionComponent<Props> = ({
  value,
  onChange,
  logLines,
}) => {
  const styles = useStyles();
  const [logTypes, setLogTypes] = useState<LogType[]>([]);

  useEffect(() => {
    debugConsole.log('useEffect: LogTypeSelect set log type');
    setLogTypes(uniq(logLines.map((line) => line.type)));
  }, [logLines]);

  const handleLogTypeChange = ({
    target,
  }: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    onChange(target.value as string);
  };

  return (
    <Select
      variant="outlined"
      margin="dense"
      className={styles.root}
      value={value}
      onChange={handleLogTypeChange}
      displayEmpty
    >
      <MenuItem value={''}>{logsText.allTypes}</MenuItem>
      {logTypes.map((logType) => (
        <MenuItem value={logType} key={logType}>
          {logType}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LogTypeSelect;