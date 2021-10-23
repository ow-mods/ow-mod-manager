import React, { useEffect, useState } from 'react';
import { Typography, makeStyles, Box } from '@material-ui/core';
import { useRecoilValue } from 'recoil';
import {
  ModManagerAlert,
  getModManagerAlert,
} from '../services/get-mod-manager-alert';
import { settingsState } from '../store';

const useStyles = makeStyles((theme) => ({
  appAlert: {
    background: theme.palette.secondary.light,
    color: theme.palette.common.black,
    padding: theme.spacing(1),
  },
}));

export const AppAlert = () => {
  const [alert, setAlert] = useState<ModManagerAlert>();
  const { alertSourceUrl } = useRecoilValue(settingsState);
  const styles = useStyles();

  useEffect(() => {
    const updateAlert = async () =>
      setAlert(await getModManagerAlert(alertSourceUrl));
    updateAlert();
  }, [alertSourceUrl]);

  if (!alert || !alert.enabled) {
    return null;
  }

  return (
    <Box className={styles.appAlert}>
      <Typography variant="body2">{alert.message}</Typography>
    </Box>
  );
};
