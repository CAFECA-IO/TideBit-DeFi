import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {UserContext} from './user_context';
import {MarketContext} from './market_context';
import {
  createDummyPrivateNotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
  INotificationItem,
} from '../interfaces/tidebit_defi_background/notification_item';
import {Event} from '../constants/event';

export interface INotificationProvider {
  children: React.ReactNode;
}

export interface INotificationContext {
  notifications: INotificationItem[] | null;
  unreadNotifications: INotificationItem[] | null;
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => void;
}

export const NotificationContext = createContext<INotificationContext>({
  notifications: null,
  unreadNotifications: null,
  isRead: (id: string) => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => null,
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  const marketCtx = useContext(MarketContext);
  const [notifications, setNotifications, notificationsRef] = useState<INotificationItem[] | null>(
    null
  );
  const [unreadNotifications, setUnreadNotifications, unreadNotificationsRef] = useState<
    INotificationItem[] | null
  >(null);
  const userCtx = useContext(UserContext);
  const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);

  const isRead = async (id: string) => {
    if (userCtx.isConnected) {
      const updateNotifications: INotificationItem[] = notificationsRef.current
        ? [...notificationsRef.current]
        : [];
      const index = updateNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        updateNotifications[index] = {
          ...updateNotifications[index],
          isRead: true,
        };
      }
      setNotifications(updateNotifications);
      setUnreadNotifications(updateNotifications.filter(n => !n.isRead));
      await userCtx.readNotifications([updateNotifications[index]]);
    }
    return;
  };

  const readAll = async () => {
    if (userCtx.isConnected) {
      const updateNotifications: INotificationItem[] = notificationsRef.current
        ? notificationsRef.current.map(n => ({
            ...n,
            isRead: true,
          }))
        : [];
      setNotifications(updateNotifications);
      setUnreadNotifications(updateNotifications.filter(n => !n.isRead));
      await userCtx.readNotifications(updateNotifications);
    }
    return;
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

  React.useEffect(() => {
    if (userCtx.wallet !== walletRef.current) {
      setWallet(userCtx.wallet);
      let updateNotifications: INotificationItem[] = notificationsRef.current
        ? [...notificationsRef.current]
        : [];
      let updateUnreadNotifications: INotificationItem[] = [];
      // Event: Login
      if (userCtx.isConnected) {
        const dummyPrivateNotification = createDummyPrivateNotificationItem(
          userCtx.wallet,
          `this is from useEffect`
        );
        updateNotifications.push(dummyPrivateNotification);
        updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
      } else {
        // Event: Logout
        updateNotifications = updateNotifications.filter(n => n.public);
        updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
      }
      setNotifications(updateNotifications);
      setUnreadNotifications(updateUnreadNotifications);
    }
  }, [userCtx.wallet]);

  const defaultValue = {
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
