import EventEmitter from 'events';
import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {ModifyType} from '../constants/modify_type';
import {OrderState} from '../constants/order_state';
import {OrderType} from '../constants/order_type';
import {TideBitEvent} from '../constants/tidebit_event';
import {IBalance} from '../interfaces/tidebit_defi_background/balance';
import {getDummyCandlestickChartData} from '../interfaces/tidebit_defi_background/candlestickData';
import {dummyDepositOrder} from '../interfaces/tidebit_defi_background/deposit_order';
// import {UserContext} from './user_context';
// import {MarketContext} from './market_context';
import {
  createDummyPrivateNotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
  INotificationItem,
} from '../interfaces/tidebit_defi_background/notification_item';
import {getDummyTicker, ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {getDummyTickerLiveStatistics} from '../interfaces/tidebit_defi_background/ticker_live_statistics';
import {getDummyTickerStatic} from '../interfaces/tidebit_defi_background/ticker_static';
import {dummyWithdrawalOrder} from '../interfaces/tidebit_defi_background/withdrawal_order';
import {IUserBalance} from './user_context';

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

let dummyDepositInterval: NodeJS.Timeout | null = null;
let dummyWithdrawInterval: NodeJS.Timeout | null = null;

export const NotificationContext = createContext<INotificationContext>({
  emitter: new EventEmitter(),
  notifications: [],
  unreadNotifications: [],
  isRead: (id: string) => Promise.resolve(),
  readAll: () => Promise.resolve(),
  init: () => Promise.resolve(),
  reset: () => null,
});

export const NotificationProvider = ({children}: INotificationProvider) => {
  // const marketCtx = useContext(MarketContext);
  const emitter = React.useMemo(() => new EventEmitter(), []);
  const [notifications, setNotifications, notificationsRef] = useState<INotificationItem[]>([]);
  const [unreadNotifications, setUnreadNotifications, unreadNotificationsRef] = useState<
    INotificationItem[]
  >([]);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);

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
    const updateNotifications: INotificationItem[] = [
      ...notificationsRef.current,
      ...notifications,
    ];
    // eslint-disable-next-line no-console
    setNotifications(updateNotifications);
    setUnreadNotifications(updateNotifications.filter(n => !n.isRead));
    // setNotifications(notifications);
    // setUnreadNotifications(notifications.filter(n => !n.isRead));
  };

  const dummyDepositUpdate = () => {
    dummyDepositInterval = setInterval(() => {
      if (selectedTickerRef.current) {
        const random = Math.random() > 0.5;
        emitter.emit(TideBitEvent.ORDER, {
          orderType: OrderType.DEPOSIT,
          modifyType: ModifyType.Add,
          orders: [dummyDepositOrder],
        });
      }
    }, 5000);
  };

  const dummyWithdrawUpdate = () => {
    dummyWithdrawInterval = setInterval(() => {
      if (selectedTickerRef.current) {
        const random = Math.random() > 0.5;
        emitter.emit(TideBitEvent.ORDER, {
          orderType: OrderType.DEPOSIT,
          modifyType: ModifyType.Add,
          orders: [dummyWithdrawalOrder],
        });
      }
    }, 5000);
  };

  const init = async () => {
    // console.log(`NotificationProvider init is called`);
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

  React.useMemo(
    () =>
      emitter.on(TideBitEvent.TICKER_CHANGE, (ticker: ITickerData) => {
        setSelectedTicker(ticker);
      }),
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
