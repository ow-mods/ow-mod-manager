import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { modProgressState } from '../../store';

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    background: theme.palette.background.default,
    color: theme.palette.primary.main,
    borderRadius: '100%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.palette.background.default,
    boxShadow: `0 0 5px 0 ${theme.palette.grey[300]}`,
  },
}));

type Props = {
  modUniqueName: string;
};

export const ModActionProgress = ({ modUniqueName }: Props) => {
  const styles = useStyles();
  const progress = useRecoilValue(modProgressState(modUniqueName));

  return (
    <CircularProgress
      variant="determinate"
      value={progress * 100}
      color="primary"
      size={24}
      thickness={23}
      className={styles.circularProgress}
    />
  );
};
