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
  notifications: INotificationItem[];
  unreadNotifications: INotificationItem[];
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => Promise<void>;
}

export const NotificationContext = createContext<INotificationContext>({
  notifications: [],
  unreadNotifications: [],
  isRead: (id: string) => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => Promise.resolve(),
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  const marketCtx = useContext(MarketContext);
  const [notifications, setNotifications] = useState<INotificationItem[]>(dummyNotifications);
  const [unreadNotifications, setUnreadNotifications] =
    useState<INotificationItem[]>(dummyUnReadNotifications);
  const userCtx = useContext(UserContext);
  const [wallet, setWallet, walletRef] = useState<string | null>(userCtx.wallet);

  const isRead = async (id: string) => {
    if (userCtx.isConnected) {
      const updateNotificationts: INotificationItem[] = [...notifications];
      const index = updateNotificationts.findIndex(n => n.id === id);
      if (index !== -1) {
        updateNotificationts[index] = {
          ...updateNotificationts[index],
          isRead: true,
        };
      }
      setNotifications(updateNotificationts);
      setUnreadNotifications(updateNotificationts.filter(n => !n.isRead));
      await userCtx.readNotifications([updateNotificationts[index]]);
    }
    return;
  };

  const readAll = async () => {
    if (userCtx.isConnected) {
      const updateNotificaionts: INotificationItem[] = [...notifications].map(n => ({
        ...n,
        isRead: true,
      }));
      setNotifications(updateNotificaionts);
      setUnreadNotifications(updateNotificaionts.filter(n => !n.isRead));
      await userCtx.readNotifications(updateNotificaionts);
    }
    return;
  };

  const init = async () => {
    setNotifications(dummyNotifications);
    setUnreadNotifications(dummyUnReadNotifications);
    return;
  };

  const reset = async () => {
    setNotifications([]);
    setUnreadNotifications([]);
    return;
  };

  React.useEffect(() => {
    if (userCtx.wallet !== walletRef.current) {
      setWallet(userCtx.wallet);
      let updateNotifications: INotificationItem[] = [...notifications];
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

  const defaultValue = {notifications, unreadNotifications, isRead, readAll, init, reset};

  return (
    <NotificationContext.Provider value={defaultValue}>{children}</NotificationContext.Provider>
  );
};
