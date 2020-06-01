import React, { useContext, useState, useCallback } from 'react';

type NotificationsState = {
  notifications: AppNotification[];
};

type NotificationSeverity = 'error' | 'warning' | 'info' | 'success';

type BaseNotification = {
  message: string;
  severity: NotificationSeverity;
};

export interface AppNotification extends BaseNotification {
  id: number;
}

interface NotificationsContext extends NotificationsState {
  pushNotification: (notification: BaseNotification) => void;
  popNotification: () => void;
}

const defaultState: NotificationsState = {
  notifications: [],
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
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const pushNotification = useCallback(
    (notification: BaseNotification) => {
      setCount((prevCount) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            ...notification,
            id: count,
          },
        ]);

        return prevCount + 1;
      });
    },
    [count],
  );

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
