import React, { useEffect, useState } from 'react';
import { makeStyles, Select, MenuItem } from '@material-ui/core';
import { uniq } from 'lodash';

import { logsText } from '../../static-text';
import { LogLine } from '../../types';

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

const ModNameSelect: React.FunctionComponent<Props> = ({
  value,
  onChange,
  logLines,
}) => {
  const styles = useStyles();
  const [modNames, setModNames] = useState<string[]>([]);

  useEffect(() => {
    console.log('useEffect: ModNameSelect set mod names');
    setModNames(uniq(logLines.map((line) => line.modName)));
  }, [logLines]);

  const handleModNameChange = ({
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
      onChange={handleModNameChange}
      displayEmpty
    >
      <MenuItem value={''}>{logsText.allMods}</MenuItem>
      {modNames.map((modName) => (
        <MenuItem value={modName} key={modName}>
          {modName}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ModNameSelect;
