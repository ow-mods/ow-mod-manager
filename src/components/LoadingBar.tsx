import React from 'react';
import { useAppState } from '../hooks/use-app-state';
import { LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}));

const LoadingBar: React.FunctionComponent = () => {
  const { loadingCount } = useAppState();
  const classes = useStyles();

  return loadingCount > 0 ? (
    <LinearProgress color="primary" className={classes.root} />
  ) : null;
};

export default LoadingBar;
