import EventEmitter from 'events';
import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
import {ModifyType} from '../constants/modify_type';
import {OrderState} from '../constants/order_state';
import {OrderType} from '../constants/order_type';
import {TideBitEvent} from '../constants/tidebit_event';
import {IBalance} from '../interfaces/tidebit_defi_background/balance';
import {getDummyCandlestickChartData} from '../interfaces/tidebit_defi_background/candlestickData';
import {getDummyClosedCFDs} from '../interfaces/tidebit_defi_background/closed_cfd_details';
import {dummyDepositOrder} from '../interfaces/tidebit_defi_background/deposit_order';
// import {UserContext} from './user_context';
// import {MarketContext} from './market_context';
import {
  createDummyPrivateNotificationItem,
  dummyNotifications,
  dummyUnReadNotifications,
  INotificationItem,
} from '../interfaces/tidebit_defi_background/notification_item';
import {getDummyOpenCFDs} from '../interfaces/tidebit_defi_background/open_cfd_details';
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
  notifications: INotificationItem[] | null;
  unreadNotifications: INotificationItem[] | null;
  isRead: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
  init: () => Promise<void>;
  reset: () => void;
}

let dummyTickerInterval;
let dummyBalanceInterval;
let dummyCFDsInterval;
let dummyDepositInterval;
let dummyWithdrawInterval;

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
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);

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

  const dummyTickerUpdate = () => {
    dummyTickerInterval = setInterval(() => {
      if (selectedTickerRef.current) {
        emitter.emit(TideBitEvent.TICKER, getDummyTicker(selectedTickerRef.current.currency));
        emitter.emit(
          TideBitEvent.TICKER_STATISTIC,
          getDummyTickerStatic(selectedTickerRef.current.currency)
        );
        emitter.emit(
          TideBitEvent.TICKER_LIVE_STATISTIC,
          getDummyTickerLiveStatistics(selectedTickerRef.current.currency)
        );
        emitter.emit(TideBitEvent.CANDLESTICK, getDummyCandlestickChartData());
      }
    }, 1000);
  };

  const dummyUserBalanceUpdate = () => {
    dummyBalanceInterval = setInterval(() => {
      emitter.emit(TideBitEvent.BALANCE, {
        available: parseInt((Math.random() * 1000).toFixed(2)),
        locked: parseInt((Math.random() * 1000).toFixed(2)),
        PNL: parseInt((Math.random() * 1000).toFixed(2)),
      } as IUserBalance);
      // emitter.emit(TideBitEvent.BALANCES);
    }, 5000);
  };

  const dummyCFDsUpdate = () => {
    dummyCFDsInterval = setInterval(() => {
      if (selectedTickerRef.current) {
        const random = Math.random() > 0.5;
        emitter.emit(TideBitEvent.ORDER, {
          orderType: OrderType.CFD,
          orderState: random ? OrderState.OPENING : OrderState.CLOSED,
          modifyType: ModifyType.Add,
          orders: random
            ? getDummyOpenCFDs(selectedTickerRef.current.currency, 1)
            : getDummyClosedCFDs(selectedTickerRef.current.currency, 1),
        });
      }
    }, 5000);
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
    setNotifications(dummyNotifications);
    setUnreadNotifications(dummyUnReadNotifications);
    registerPublicNotification();
    return await Promise.resolve();
  };

  const reset = () => {
    setNotifications([]);
    setUnreadNotifications([]);
    return;
  };
  const registerPublicNotification = () => {
    dummyTickerUpdate();
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
    dummyUserBalanceUpdate();
    dummyCFDsUpdate();
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
    clearInterval(dummyBalanceInterval);
    clearInterval(dummyCFDsInterval);
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

  React.useMemo(
    () =>
      emitter.on(TideBitEvent.TICKER_CHANGE, (ticker: ITickerData) => {
        setSelectedTicker(ticker);
      }),
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
