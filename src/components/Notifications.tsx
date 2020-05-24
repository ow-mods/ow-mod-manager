import React from 'react';
import { useNotifications } from '../hooks';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const Notifications: React.FunctionComponent = () => {
  const { notifications, popNotification } = useNotifications();

  return (
    <Snackbar
      open={notifications.length > 0}
      message={notifications[0].message}
      action={
        <IconButton
          onClick={popNotification}
          size="small"
          aria-label="close"
          color="inherit"
        >
          <Close fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default Notifications;
