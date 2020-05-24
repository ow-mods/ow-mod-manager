import React, { useContext, useState, useCallback } from 'react';

type NotificationsState = {
  notifications: AppNotification[];
};

type NotificationSeverity = 'error' | 'warning' | 'info' | 'success';
type AppNotification = {
  message: string;
  severity: NotificationSeverity;
};

interface NotificationsContext extends NotificationsState {
  pushNotification: (message: string, severity: NotificationSeverity) => void;
  popNotification: () => void;
}

const defaultState: NotificationsState = {
  notifications: [
    {
      message: 'hello',
      severity: 'error',
    },
  ],
};

const Notifications = React.createContext<NotificationsContext>({
  ...defaultState,
  pushNotification: () => {},
  popNotification: () => {},
});

export const useNotifications = () => useContext(Notifications);

export const NotificationsProvider: React.FunctionComponent = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    defaultState.notifications,
  );

  const pushNotification = useCallback((message, severity) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, severity },
    ]);
  }, []);

  const popNotification = useCallback(() => {
    setNotifications((prevNotifications) =>
      prevNotifications.slice(0, prevNotifications.length - 1),
    );
  }, []);

  return (
    <Notifications.Provider
      value={{ pushNotification, notifications, popNotification }}
    >
      {children}
    </Notifications.Provider>
  );
};
