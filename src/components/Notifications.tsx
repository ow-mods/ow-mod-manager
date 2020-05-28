import React from 'react';
import { useNotifications, AppNotification } from '../hooks';
import {
  Snackbar,
  IconButton,
  makeStyles,
  SnackbarContent,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  error: {
    background: theme.palette.error.dark,
    color: theme.palette.text.primary,
  },
  warning: {
    background: theme.palette.warning.dark,
    color: theme.palette.text.primary,
  },
  info: {
    background: theme.palette.info.dark,
    color: theme.palette.text.primary,
  },
  success: {
    background: theme.palette.success.dark,
    color: theme.palette.text.primary,
  },
}));

const emptyNotification: AppNotification = {
  message: '',
  severity: 'info',
  id: '',
};

const Notifications: React.FunctionComponent = () => {
  const styles = useStyles();
  const { notifications, popNotification } = useNotifications();

  const isOpen = notifications.length > 0;
  const notification = isOpen
    ? notifications[notifications.length - 1]
    : emptyNotification;

  return (
    <Snackbar key={notification.id} open={isOpen}>
      <SnackbarContent
        className={styles[notification.severity]}
        message={notification.message}
        action={
          <IconButton
            onClick={popNotification}
            size="small"
            aria-label="close"
            color="inherit"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      ></SnackbarContent>
    </Snackbar>
  );
};

export default Notifications;
