import React from 'react';
import { Paper, Toolbar, makeStyles } from '@material-ui/core';
import { useRecoilState } from 'recoil';

import { modsText } from '../../static-text';
import FilterInput from '../FilterInput';
import { modFilterState } from '../../store';

const useStyles = makeStyles((theme) => ({
  toolBar: {
    justifyContent: 'space-between',
    minHeight: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

const ModsToolbar: React.FunctionComponent = () => {
  const styles = useStyles();
  const [filter, setFilter] = useRecoilState(modFilterState);
  return (
    <Paper>
      <Toolbar className={styles.toolBar}>
        <FilterInput
          value={filter}
          onChange={setFilter}
          label={modsText.findModsLabel}
        />
      </Toolbar>
    </Paper>
  );
};

export default ModsToolbar;
