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
    background: theme.palette.warning.light,
    color: theme.palette.getContrastText(theme.palette.warning.light),
    padding: theme.spacing(2),
    borderRadius: 0,
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
      <Typography>{alert.message}</Typography>
    </Box>
  );
};
