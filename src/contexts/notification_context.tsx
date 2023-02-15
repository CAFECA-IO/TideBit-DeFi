import React, {useState, useContext, createContext} from 'react';
import {UserContext} from './user_context';
import {MarketContext} from './market_context';
import {
  dummyNotifications,
  dummyUnReadNotifications,
  INotificationItem,
} from '../interfaces/tidebit_defi_background/notification_item';

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
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  //   const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  //   const [unreadNotifications, setUnreadNotifications] = useState<INotificationItem[]>([]);
  const [notifications, setNotifications] = useState<INotificationItem[]>(dummyNotifications);
  const [unreadNotifications, setUnreadNotifications] =
    useState<INotificationItem[]>(dummyUnReadNotifications);

  const isRead = async (id: string) => {
    const updateNotificaionts: INotificationItem[] = [...notifications];
    const index = updateNotificaionts.findIndex(n => n.id === id);
    if (index !== -1) {
      updateNotificaionts[index] = {
        ...updateNotificaionts[index],
        isRead: true,
      };
    }
    setNotifications(updateNotificaionts);
    setUnreadNotifications(updateNotificaionts.filter(n => !n.isRead));
    if (userCtx.isConnected) {
      await userCtx.readNotifications([updateNotificaionts[index]]);
    }
    return;
  };

  const readAll = async () => {
    //async () => {
    const updateNotificaionts: INotificationItem[] = [...notifications].map(n => ({
      ...n,
      isRead: true,
    }));
    setNotifications(updateNotificaionts);
    setUnreadNotifications(updateNotificaionts.filter(n => !n.isRead));
    if (userCtx.isConnected) {
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

  const defaultValue = {notifications, unreadNotifications, isRead, readAll, init, reset};

  return (
    <NotificationContext.Provider value={defaultValue}>{children}</NotificationContext.Provider>
  );
};
