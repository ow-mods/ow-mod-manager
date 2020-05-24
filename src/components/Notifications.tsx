import React from 'react';
import { useNotifications, AppNotification } from '../hooks';
import { Snackbar, IconButton, makeStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.error.main,
  },
}));

const emptyNotification: AppNotification = {
  message: '',
  severity: 'info',
  id: -1,
};

const Notifications: React.FunctionComponent = () => {
  const styles = useStyles();
  const { notifications, popNotification } = useNotifications();

  const isOpen = notifications.length > 0;
  const notification = isOpen
    ? notifications[notifications.length - 1]
    : emptyNotification;

  return (
    <Snackbar
      key={notification.id}
      open={isOpen}
      message={notification.message}
      className={styles.root}
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
    />
  );
};

export default Notifications;
