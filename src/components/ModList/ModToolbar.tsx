import React from 'react';

import {
  Toolbar,
  Switch,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import FilterInput from '../FilterInput';

const useStyles = makeStyles({
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ModToolbar: React.FunctionComponent = () => {
  const styles = useStyles();

  return (
    <Toolbar variant="dense" className={styles.toolBar}>
      <FilterInput />
      <div>
        <FormControlLabel
          control={<Switch checked={true} onChange={() => {}} />}
          label="Installed"
        />
        <FormControlLabel
          control={<Switch checked={true} onChange={() => {}} />}
          label="Not installed"
        />
      </div>
    </Toolbar>
  );
};

export default ModToolbar;
