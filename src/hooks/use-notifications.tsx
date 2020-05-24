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
  addNotification: (message: string, severity: NotificationSeverity) => void;
}

const defaultState: NotificationsState = {
  notifications: [],
};

const Notifications = React.createContext<NotificationsContext>({
  ...defaultState,
  addNotification: () => {},
});

export const useNotifications = () => useContext(Notifications);

export const NotificationsProvider: React.FunctionComponent = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((message, severity) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, severity },
    ]);
  }, []);

  return (
    <Notifications.Provider value={{ addNotification, notifications }}>
      {children}
    </Notifications.Provider>
  );
};
