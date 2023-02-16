/* eslint-disable no-console */
import React, {useState, useContext, createContext} from 'react';
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
  const [wallet, setWallet] = useState<string | null>(userCtx.wallet);
  userCtx.emitter.on(Event.ACCOUNT_CHANGED, () => {
    // TODO: clearPrivateNotifications
    // TODO: getPrivateNotifications
    console.log(`NotificationProvider on ACCOUNT_CHANGED => resetPrivateNotifications`);
    const updateNotifications: INotificationItem[] = [...notifications];
    let updateUnreadNotifications: INotificationItem[] = [];
    const dummyPrivateNotification = createDummyPrivateNotificationItem(
      userCtx.id!,
      `this is from EventEmitter`
    );
    updateNotifications.push(dummyPrivateNotification);
    updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
    setNotifications(updateNotifications);
    setUnreadNotifications(updateUnreadNotifications);
  });
  userCtx.emitter.on(Event.DISCONNECTED, () => {
    // TODO: clearPrivateNotifications
    console.log(`NotificationProvider on DISCONNECTED => clearPrivateNotifications`);
    let updateNotifications: INotificationItem[] = [...notifications];
    let updateUnreadNotifications: INotificationItem[] = [];
    updateNotifications = updateNotifications.filter(n => n.public);
    updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
    setNotifications(updateNotifications);
    setUnreadNotifications(updateUnreadNotifications);
  });
  React.useEffect(() => {
    console.log(
      `NotificationProvider React.useEffect wallet:`,
      wallet,
      `userCtx.wallet:`,
      userCtx.wallet,
      userCtx.wallet === wallet
    );
    if (userCtx.wallet !== wallet) {
      setWallet(userCtx.wallet);
      let updateNotifications: INotificationItem[] = [...notifications];
      let updateUnreadNotifications: INotificationItem[] = [];
      if (userCtx.isConnected) {
        const dummyPrivateNotification = createDummyPrivateNotificationItem(
          userCtx.id!,
          `this is from useEffect`
        );
        updateNotifications.push(dummyPrivateNotification);
        updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
      } else {
        updateNotifications = updateNotifications.filter(n => n.public);
        updateUnreadNotifications = updateNotifications.filter(n => !n.isRead);
      }
      setNotifications(updateNotifications);
      setUnreadNotifications(updateUnreadNotifications);
    }
  }, [userCtx.wallet]);

  const isRead = async (id: string) => {
    if (userCtx.isConnected) {
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
      await userCtx.readNotifications([updateNotificaionts[index]]);
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

  const defaultValue = {notifications, unreadNotifications, isRead, readAll, init, reset};

  return (
    <NotificationContext.Provider value={defaultValue}>{children}</NotificationContext.Provider>
  );
};
