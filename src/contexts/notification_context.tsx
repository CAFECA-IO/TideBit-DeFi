import EventEmitter from 'events';
import React, {createContext} from 'react';
import useState from 'react-usestateref';
import {TideBitEvent} from '../constants/tidebit_event';
import {
  INotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
} from '../interfaces/tidebit_defi_background/notification_item';

export interface INotificationProvider {
  children: React.ReactNode;
}

export interface INotificationContext {
  emitter: EventEmitter;
  notifications: INotificationItem[];
  unreadNotifications: INotificationItem[];
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => void;
}

export const NotificationContext = createContext<INotificationContext>({
  emitter: new EventEmitter(),
  notifications: [],
  unreadNotifications: [],
  isRead: () => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => null,
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  // const marketCtx = useContext(MarketContext);

  const emitter = React.useMemo(() => new EventEmitter(), []);
  const [notifications, setNotifications, notificationsRef] =
    useState<INotificationItem[]>(dummyNotifications);
  const [unreadNotifications, setUnreadNotifications, unreadNotificationsRef] =
    useState<INotificationItem[]>(dummyUnReadNotifications);

  const isRead = async (id: string) => {
    const updatedNotifications: INotificationItem[] = [...notificationsRef.current];
    const index = updatedNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        isRead: true,
      };
    }
    emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS, updatedNotifications);
    updateNotifications(updatedNotifications);
    return;
  };

  const readAll = async () => {
    const updatedNotifications: INotificationItem[] = notificationsRef.current
      ? notificationsRef.current.map(n => ({
          ...n,
          isRead: true,
        }))
      : [];
    emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS, updatedNotifications);
    updateNotifications(updatedNotifications);
    return;
  };

  const updateNotifications = (notifications: INotificationItem[]) => {
    const updateNotifications: INotificationItem[] = [...notifications];
    setNotifications(updateNotifications);
    setUnreadNotifications(updateNotifications.filter(n => !n.isRead));
  };

  const init = async () => {
    return await Promise.resolve();
  };

  const reset = () => {
    setNotifications([]);
    setUnreadNotifications([]);
    return;
  };

  // Event: Logout
  const clearPrivateNotification = () => {
    let updateNotifications: INotificationItem[] = notificationsRef.current
      ? [...notificationsRef.current]
      : [];
    let updateUnreadNotifications: INotificationItem[] = [];
    updateNotifications = updateNotifications.filter(n => n.public);
    updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
    setNotifications(updateNotifications);
    setUnreadNotifications(updateUnreadNotifications);
  };

  React.useMemo(() => emitter.on(TideBitEvent.DISCONNECTED, clearPrivateNotification), []);
  React.useMemo(
    () => emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, updateNotifications),
    []
  );
  React.useMemo(() => emitter.on(TideBitEvent.NOTIFICATIONS, updateNotifications), []);

  const defaultValue = {
    emitter,
    notifications: notificationsRef.current,
    unreadNotifications: unreadNotificationsRef.current,
    isRead,
    readAll,
    init,
    reset,
  };

  return (
    <NotificationContext.Provider value={defaultValue}>{children}</NotificationContext.Provider>
  );
};
