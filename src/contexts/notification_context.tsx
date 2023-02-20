import EventEmitter from 'events';
import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {TideBitEvent} from '../constants/tidebit_event';
// import {UserContext} from './user_context';
// import {MarketContext} from './market_context';
import {
  createDummyPrivateNotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
  INotificationItem,
} from '../interfaces/tidebit_defi_background/notification_item';

export interface INotificationProvider {
  children: React.ReactNode;
}

export interface INotificationContext {
  emitter: EventEmitter;
  notifications: INotificationItem[] | null;
  unreadNotifications: INotificationItem[] | null;
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => void;
}

export const NotificationContext = createContext<INotificationContext>({
  emitter: new EventEmitter(),
  notifications: null,
  unreadNotifications: null,
  isRead: (id: string) => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => null,
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  // const marketCtx = useContext(MarketContext);
  // const userCtx = useContext(UserContext);
  const emitter = React.useMemo(() => new EventEmitter(), []);
  const [notifications, setNotifications, notificationsRef] = useState<INotificationItem[] | null>(
    null
  );
  const [unreadNotifications, setUnreadNotifications, unreadNotificationsRef] = useState<
    INotificationItem[] | null
  >(null);

  const isRead = async (id: string) => {
    const updatedNotifications: INotificationItem[] = notificationsRef.current
      ? [...notificationsRef.current]
      : [];
    const index = updatedNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        isRead: true,
      };
    }
    emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS, updatedNotifications);
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
    return;
  };

  const updateNotifications = (notifications: INotificationItem[]) => {
    setNotifications(notifications);
    setUnreadNotifications(notifications.filter(n => !n.isRead));
  };

  const init = async () => {
    // console.log(`NotificationProvider init is called`);
    setNotifications(dummyNotifications);
    setUnreadNotifications(dummyUnReadNotifications);
    return await Promise.resolve();
  };

  const reset = () => {
    setNotifications([]);
    setUnreadNotifications([]);
    return;
  };

  // Event: Login
  const registerPrivateNotification = (address: string) => {
    // TODO: receive more than once
    const updateNotifications: INotificationItem[] = notificationsRef.current
      ? [...notificationsRef.current]
      : [];
    let updateUnreadNotifications: INotificationItem[] = [];
    const dummyPrivateNotification = createDummyPrivateNotificationItem(
      address,
      `this is from userContext`
    );
    updateNotifications.push(dummyPrivateNotification);
    updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
    setNotifications(updateNotifications);
    setUnreadNotifications(updateUnreadNotifications);
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

  React.useMemo(
    () => emitter.on(TideBitEvent.SERVICE_TERM_ENABLED, registerPrivateNotification),
    []
  );
  React.useMemo(() => emitter.on(TideBitEvent.DISCONNECTED_WALLET, clearPrivateNotification), []);
  React.useMemo(
    () => emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, updateNotifications),
    []
  );

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
