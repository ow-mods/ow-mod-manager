import React, { useContext, useState, useCallback } from 'react';

type NotificationsState = {
  notifications: AppNotification[];
};

type BaseNotification = {
  message: string;
  severity: LogType;
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
  const [, setCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const pushNotification = useCallback((notification: BaseNotification) => {
    setCount((prevCount) => {
      setNotifications((prevNotifications) => {
        const existing = prevNotifications.find(
          ({ message }) => message === notification.message,
        );
        if (existing) {
          return prevNotifications;
        }
        return [
          ...prevNotifications,
          {
            ...notification,
            id: prevCount,
          },
        ];
      });

      return prevCount + 1;
    });
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
