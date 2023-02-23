import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext} from 'react';
import useState from 'react-usestateref';
import {TypeOfPnLColorHex} from '../constants/display';
import {
  IOpenCFDDetails,
  dummyOpenCFDDetails,
  getDummyOpenCFDs,
} from '../interfaces/tidebit_defi_background/open_cfd_details';
import {
  IClosedCFDDetails,
  dummyCloseCFDDetails,
  getDummyClosedCFDs,
} from '../interfaces/tidebit_defi_background/closed_cfd_details';
import {
  dummyResultFailed,
  dummyResultSuccess,
  IResult,
} from '../interfaces/tidebit_defi_background/result';
import {
  dummyWalletBalance_BTC,
  dummyWalletBalance_ETH,
  dummyWalletBalance_USDT,
  IWalletBalance,
} from '../interfaces/tidebit_defi_background/wallet_balance';
import {ICFDOrderUpdateRequest} from '../interfaces/tidebit_defi_background/cfd_order_update';
import {getDummyBalances, IBalance} from '../interfaces/tidebit_defi_background/balance';
import {
  dummyPublicCFDOrder,
  dummyPublicDepositOrder,
  dummyPublicWithdrawOrder,
} from '../interfaces/tidebit_defi_background/public_order';
import {IOrderResult} from '../interfaces/tidebit_defi_background/order_result';
import {IOrder} from '../interfaces/tidebit_defi_background/order';
import {
  dummyDepositOrder,
  IDepositOrder,
} from '../interfaces/tidebit_defi_background/deposit_order';
import {
  dummyWithdrawalOrder,
  IWithdrawalOrder,
} from '../interfaces/tidebit_defi_background/withdrawal_order';
import {IOpenCFDOrder} from '../interfaces/tidebit_defi_background/open_cfd_order';
import {INotificationItem} from '../interfaces/tidebit_defi_background/notification_item';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {ICFDDetails} from '../interfaces/tidebit_defi_background/cfd_details';
import {IOrderState, OrderState} from '../constants/order_state';
import {IModifyType, ModifyType} from '../constants/modify_type';
import {IOrderType, OrderType} from '../constants/order_type';
import {WorkerContext} from './worker_context';
// const sampleArray = randomArray(1100, 1200, 10);

const strokeColorDisplayed = (sampleArray: number[]) => {
  if (sampleArray[sampleArray.length - 1] > sampleArray[sampleArray.length - 2]) {
    // priceColor = 'text-lightGreen';
    return [TypeOfPnLColorHex.PROFIT];
  }

  // priceColor = 'text-lightRed';
  return [TypeOfPnLColorHex.LOSS];
};

export interface IUserBalance {
  available: number;
  locked: number;
  PNL: number;
  // walletBalance: number; // deposit required info
  // interest: number; // 入金的利息
}
export interface IUser {
  id: string;
  // username: string;
  // email?: string;
  // wallet: string[];

  // favoriteTickers: string[];
  // balance: IUserBalance;
  // walletBalance: number;

  // // orderEngine: string; // 產生 EIP 712 / 出金入金 要的資料
  // isSubscibedNewsletters: boolean;
  // isEnabledEmailNotification: boolean;
  // isConnected: boolean;
  // isConnectedWithEmail: boolean;
  // isConnectedWithTideBit: boolean;
  // walletId: string;
  // tideBitId: string;
  // enableServiceTerm: boolean;
}

export interface IUserProvider {
  children: React.ReactNode;
}

export interface IUserContext {
  id: string | null;
  username: string | null;
  wallet: string | null;
  walletBalances: IWalletBalance[] | null;
  balance: IUserBalance | null;
  favoriteTickers: string[];
  isConnected: boolean;
  enableServiceTerm: boolean;
  openCFDs: IOpenCFDDetails[];
  closedCFDs: IClosedCFDDetails[];
  connect: () => Promise<boolean>;
  signServiceTerm: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  addFavorites: (props: string) => IResult;
  removeFavorites: (props: string) => IResult;
  listOpenCFDs: (props: string) => Promise<IOpenCFDDetails[]>;
  listClosedCFDs: (props: string) => Promise<IClosedCFDDetails[]>;
  // getOpendCFD: (props: string) => Promise<IOpenCFDDetails>;
  // getClosedCFD: (props: string) => Promise<IClosedCFDDetails>;
  getOpendCFD: (props: string) => IOpenCFDDetails;
  getClosedCFD: (props: string) => IClosedCFDDetails;

  // TODO:
  histories: IOrder[];
  balances: IBalance[] | null;
  email: string | null;
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  getBalance: (props: string) => IBalance | null;
  getWalletBalance: (props: string) => IWalletBalance | null;
  createOrder: (props: IOpenCFDOrder) => Promise<IOrderResult>;
  closeOrder: (props: {id: string}) => Promise<IOrderResult>;
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise<IOrderResult>;
  deposit: (props: IDepositOrder) => Promise<IOrderResult>;
  withdraw: (props: IWithdrawalOrder) => Promise<IOrderResult>;
  listHistories: (props: string) => Promise<IOrder[]>;
  sendEmailCode: (email: string) => Promise<number>;
  connectEmail: (email: string, code: number) => Promise<boolean>;
  toggleEmailNotification: (props: boolean) => Promise<boolean>;
  subscribeNewsletters: (props: boolean) => Promise<boolean>;
  connectTideBit: (email: string, password: string) => Promise<boolean>;
  shareTradeRecord: (tradeId: string) => Promise<boolean>;
  readNotifications: (notifications: INotificationItem[]) => Promise<void>;
  init: () => Promise<void>;
}

export const UserContext = createContext<IUserContext>({
  id: null,
  username: null,
  wallet: null,
  walletBalances: null,
  balance: null,
  favoriteTickers: [],
  isConnected: false,
  enableServiceTerm: false,
  openCFDs: [],
  closedCFDs: [],
  connect: () => Promise.resolve(true),
  signServiceTerm: () => Promise.resolve(true),
  disconnect: () => Promise.resolve(true),
  addFavorites: (props: string) => dummyResultSuccess,
  removeFavorites: (props: string) => dummyResultSuccess,
  listOpenCFDs: (props: string) => Promise.resolve<IOpenCFDDetails[]>([]),
  listClosedCFDs: (props: string) => Promise.resolve<IClosedCFDDetails[]>([]),
  // getOpendCFD: (props: string) => Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails),
  // getClosedCFD: (props: string) => Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails),
  getOpendCFD: (props: string) => dummyOpenCFDDetails,
  getClosedCFD: (props: string) => dummyCloseCFDDetails,

  // TODO:
  histories: [],
  balances: null,
  email: null,
  isSubscibedNewsletters: false,
  isEnabledEmailNotification: false,
  isConnectedWithEmail: false,
  isConnectedWithTideBit: false,
  getBalance: (props: string) => null,
  getWalletBalance: (props: string) => null,
  createOrder: (props: IOpenCFDOrder) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  closeOrder: (props: {id: string}) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  deposit: IDepositOrder => Promise.resolve<IOrderResult>(dummyResultSuccess),
  withdraw: IWithdrawalOrder => Promise.resolve<IOrderResult>(dummyResultSuccess),
  listHistories: () => Promise.resolve<IOrder[]>([]),
  sendEmailCode: (email: string) => Promise.resolve<number>(359123),
  connectEmail: (email: string, code: number) => Promise.resolve<boolean>(true),
  toggleEmailNotification: (props: boolean) => Promise.resolve<boolean>(true),
  subscribeNewsletters: (props: boolean) => Promise.resolve<boolean>(true),
  connectTideBit: (email: string, password: string) => Promise.resolve<boolean>(true),
  shareTradeRecord: (tradeId: string) => Promise.resolve<boolean>(true),
  readNotifications: (notifications: INotificationItem[]) => Promise.resolve(),
  init: () => Promise.resolve(),
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const workerCtx = useContext(WorkerContext);
  const [id, setId, idRef] = useState<string | null>(null);
  const [username, setUsername, usernameRef] = useState<string | null>(null);
  const [wallet, setWallet, walletRef] = useState<string | null>(null);
  const [email, setEmail, emailRef] = useState<string | null>(null);
  const [walletBalances, setWalletBalances, walletBalancesRef] = useState<IWalletBalance[] | null>(
    null
  );
  const [balance, setBalance, balanceRef] = useState<IUserBalance | null>(null);
  const [balances, setBalances, balancesRef] = useState<IBalance[] | null>(null);
  const [favoriteTickers, setFavoriteTickers, favoriteTickersRef] = useState<string[]>([]);
  const [isConnected, setIsConnected, isConnectedRef] = useState<boolean>(false);
  const [enableServiceTerm, setEnableServiceTerm, enableServiceTermRef] = useState<boolean>(false);
  const [histories, setHistories, historiesRef] = useState<IOrder[]>([]);
  const [openCFDs, setOpenedCFDs, openCFDsRef] = useState<Array<IOpenCFDDetails>>([]);
  const [closedCFDs, setClosedCFDs, closedCFDsRef] = useState<Array<IClosedCFDDetails>>([]);
  const [isSubscibedNewsletters, setIsSubscibedNewsletters, isSubscibedNewslettersRef] =
    useState<boolean>(false);
  const [isEnabledEmailNotification, setIsEnabledEmailNotification, isEnabledEmailNotificationRef] =
    useState<boolean>(false);
  const [isConnectedWithEmail, setIsConnectedWithEmail, isConnectedWithEmailRef] =
    useState<boolean>(false);
  const [isConnectedWithTideBit, setIsConnectedWithTideBit, isConnectedWithTideBitRef] =
    useState<boolean>(false);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);

  const notificationCtx = useContext(NotificationContext);

  const setPrivateData = async (walletAddress: string) => {
    setWallet(walletAddress);
    setWalletBalances([dummyWalletBalance_BTC, dummyWalletBalance_ETH, dummyWalletBalance_USDT]);
    // TODO getUser from backend by walletAddress
    setId('002');
    setUsername('Tidebit DeFi Test User');
    setBalance({
      available: 1296.47,
      locked: 583.62,
      PNL: 1956.84,
    });
    setBalances(getDummyBalances());
    if (selectedTickerRef.current) {
      listOpenCFDs(selectedTickerRef.current.currency);
      listClosedCFDs(selectedTickerRef.current.currency);
    }
    workerCtx.registerUserHandler(walletAddress);
  };

  const clearPrivateData = () => {
    setEnableServiceTerm(false);
    setId(null);
    setUsername(null);
    setWallet(null);
    setWalletBalances(null);
    setBalance(null);
    setOpenedCFDs([]);
    setClosedCFDs([]);
    notificationCtx.emitter.emit(TideBitEvent.DISCONNECTED_WALLET);
  };

  const lunar = new Lunar();
  lunar.on('connected', () => {
    setIsConnected(true);
  });
  lunar.on('disconnected', () => {
    setIsConnected(false);
    clearPrivateData();
  });
  lunar.on('accountsChanged', async (address: string) => {
    clearPrivateData();
  });

  const listOpenCFDs = useCallback(async (props: string) => {
    let updateOpenCFDs: IOpenCFDDetails[] = [];
    if (enableServiceTermRef.current) {
      updateOpenCFDs = await Promise.resolve<IOpenCFDDetails[]>(getDummyOpenCFDs(props));
    }
    setOpenedCFDs(updateOpenCFDs);
    return updateOpenCFDs;
  }, []);

  const listClosedCFDs = async (props: string) => {
    let closedCFDs: IClosedCFDDetails[] = [];
    if (enableServiceTermRef.current) {
      closedCFDs = await Promise.resolve<IClosedCFDDetails[]>(getDummyClosedCFDs(props));
    }
    setClosedCFDs(closedCFDs);
    return closedCFDs;
  };

  const connect = async () => {
    let success = false;
    try {
      const connect = await lunar.connect({});
      if (connect) {
        success = true;
      }
    } catch (error) {
      // console.error(`userContext connect error`, error);
    }
    return success;
  };

  const signServiceTerm = async () => {
    setEnableServiceTerm(true);
    await setPrivateData(lunar.address);
    return true;
  };

  const disconnect = async () => {
    let success = false;
    try {
      await lunar.disconnect();
      success = true;
    } catch (error) {
      // console.error(`userContext disconnect error`, error);
    }
    return success;
  };

  const addFavorites = (newFavorite: string) => {
    let result: IResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      // console.log(`userContext updatedFavoriteTickers`, updatedFavoriteTickers);
      result = dummyResultSuccess;
    }
    return result;
  };

  const removeFavorites = (previousFavorite: string) => {
    let result: IResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(
        currency => currency === previousFavorite
      );
      if (index !== -1) updatedFavoriteTickers.splice(index, 1);
      setFavoriteTickers(updatedFavoriteTickers);
      // console.log(`userContext updatedFavoriteTickers`, updatedFavoriteTickers);
      result = dummyResultSuccess;
    }
    return result;
  };

  // const getOpendCFD = async (id: string) =>
  //   await Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails);
  const getOpendCFD = (id: string) => dummyOpenCFDDetails;

  // const getClosedCFD = async (props: string) =>
  //   Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails);
  const getClosedCFD = (id: string) => dummyCloseCFDDetails;

  const getWalletBalance = (props: string) => {
    let walletBalance: IWalletBalance | null = null;
    if (walletBalancesRef.current) {
      const index: number = walletBalancesRef.current.findIndex(wb => wb.currency === props);
      if (index !== -1) walletBalance = walletBalancesRef.current[index];
    }
    return walletBalance;
  };

  const getBalance = (props: string) => {
    let balance: IBalance | null = null;
    if (balancesRef.current) {
      const index: number = balancesRef.current.findIndex(wb => wb.currency === props);
      if (index !== -1) balance = balancesRef.current[index];
    }
    return balance;
  };

  const createOrder = async (props: IOpenCFDOrder) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const balance: IBalance | null = getBalance(props.ticker); // TODO: ticker is not currency
      if (balance && balance.available >= props.positionValue) {
        // TODO: balance.available > ?
        // TODO: OrderEngine create signable order data
        result = {
          success: true,
          data: dummyPublicCFDOrder,
        };
      }
    }
    return await Promise.resolve<IOrderResult>(result);
  };

  const closeOrder = async (props: {id: string}) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      // check order is exist
      // if(order is live)
      // TODO: OrderEngine create signable closeOrder data
      result = {
        success: true,
        data: dummyPublicCFDOrder,
      };
    }
    return await Promise.resolve<IOrderResult>(result);
  };

  const updateOrder = async (props: ICFDOrderUpdateRequest) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      // check order is exist
      // if(order is live)
      // TODO: OrderEngine create signable updateOrder data
      result = {
        success: true,
        data: dummyPublicCFDOrder,
      };
    }
    return await Promise.resolve<IOrderResult>(result);
  };

  const deposit = async (depositOrder: IDepositOrder) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const walletBalance: IWalletBalance | null = getWalletBalance(depositOrder.targetAsset);
      // if(balance is enough)
      if (walletBalance && walletBalance.balance >= depositOrder.targetAmount) {
        // TODO: OrderEngine create signable deposit data
        // TODO: updateWalletBalances
        result = {
          success: true,
          data: dummyPublicDepositOrder, // new walletBalance
        };
      }
    }
    return await Promise.resolve<IOrderResult>(result);
  };

  const withdraw = async (witherOrder: IWithdrawalOrder) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const balance: IBalance | null = getBalance(witherOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= witherOrder.targetAmount) {
        // TODO: balance.available > ?
        // TODO: OrderEngine create withdraw order data
        result = {
          success: true,
          data: dummyPublicWithdrawOrder,
        };
      }
    }
    return await Promise.resolve<IOrderResult>(result);
  };

  const listHistories = async () => {
    let histories: IOrder[] = [];
    if (isConnectedRef) {
      // TODO: getHistories from backend
      histories = [dummyDepositOrder, dummyWithdrawalOrder];
      setHistories(histories);
    }
    return histories;
  };

  // ++TODO: ModifyType.REMOVE and ModifyType.UPDATE
  const updateOpenCFD = (data: {modifyType: IModifyType; CFDs: IOpenCFDDetails[]}) => {
    switch (data.modifyType) {
      case ModifyType.Add:
        setOpenedCFDs(prev => [...prev, ...data.CFDs]);
        break;
      case ModifyType.REMOVE:
        break;
      case ModifyType.UPDATE:
        break;
      default:
        break;
    }
  };

  const updateClosedCFD = (data: {modifyType: IModifyType; CFDs: IClosedCFDDetails[]}) => {
    switch (data.modifyType) {
      case ModifyType.Add:
        setClosedCFDs(prev => [...prev, ...data.CFDs]);
        break;
      case ModifyType.REMOVE:
        break;
      case ModifyType.UPDATE:
        break;
      default:
        break;
    }
  };

  const updateUserBehavior = (data: {
    modifyType: IModifyType;
    orderType: IOrderType;
    orderState?: IOrderState;
    orders: [];
  }) => {
    // eslint-disable-next-line no-console
    console.log(`updateUserBehavior data`, data);
    if (data.orderType === OrderType.CFD) {
      if (data.orderState === OrderState.OPENING) {
        updateOpenCFD({
          modifyType: data.modifyType,
          CFDs: data.orders as IOpenCFDDetails[],
        });
      }
      if (data.orderState === OrderState.CLOSED) {
        updateClosedCFD({
          modifyType: data.modifyType,
          CFDs: data.orders as IClosedCFDDetails[],
        });
      }
    } else {
      // ++ TODO: WITHDRAW and DEPOSIT, UPDATE Histories
    }
  };

  const sendEmailCode = async (email: string) => Promise.resolve<number>(359123);
  const connectEmail = async (email: string, code: number) => Promise.resolve<boolean>(true);
  const toggleEmailNotification = async (props: boolean) => Promise.resolve<boolean>(true);
  const subscribeNewsletters = async (props: boolean) => Promise.resolve<boolean>(true);
  const connectTideBit = async (email: string, password: string) => Promise.resolve<boolean>(true);
  const shareTradeRecord = async (tradeId: string) => Promise.resolve<boolean>(true);

  const readNotifications = async (notifications: INotificationItem[]) => {
    if (enableServiceTermRef.current) {
      notificationCtx.emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, notifications);
    }
  };

  const updateBalances = (balance: IBalance) => {
    if (balancesRef.current) {
      const updateBalances = [...balancesRef.current];
      const index = balancesRef.current.findIndex(
        _balance => _balance.currency === balance.currency
      );
      if (index !== -1) {
        updateBalances[index] = balance;
      } else updateBalances.push(balance);
    } else {
      setBalances([balance]);
    }
  };

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.BALANCE, (balance: IUserBalance) => {
        setBalance(balance);
      }),
    []
  );
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.BALANCES, updateBalances), []);
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.BALANCES, ()=>{}), []);
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.DEPOSIT, updateUserBehavior), []);
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.WITHDRAW, updateUserBehavior), []);
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.OPEN_CFD, updateOpenCFD), []);
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.CLOSE_CFD, updateClosedCFD), []);
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.ORDER, updateUserBehavior), []);
  React.useMemo(
    () => notificationCtx.emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS, readNotifications),
    []
  );
  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, (ticker: ITickerData) => {
        setSelectedTicker(ticker);
        listOpenCFDs(ticker.currency);
        listClosedCFDs(ticker.currency);
      }),
    []
  );

  const init = async () => {
    // console.log(`UserProvider init is called`);
    return await Promise.resolve();
  };

  const defaultValue = {
    init,
    id: idRef.current,
    username: usernameRef.current,
    wallet: walletRef.current,
    walletBalances: walletBalancesRef.current,
    balance: balanceRef.current,
    balances: balancesRef.current,
    favoriteTickers: favoriteTickersRef.current,
    isConnected: isConnectedRef.current,
    enableServiceTerm: enableServiceTermRef.current,
    openCFDs: openCFDsRef.current,
    closedCFDs: closedCFDsRef.current,
    email: emailRef.current,
    isSubscibedNewsletters: isSubscibedNewslettersRef.current,
    isEnabledEmailNotification: isEnabledEmailNotificationRef.current,
    isConnectedWithEmail: isConnectedWithEmailRef.current,
    isConnectedWithTideBit: isConnectedWithTideBitRef.current,
    histories: historiesRef.current,
    addFavorites,
    removeFavorites,
    listOpenCFDs,
    getOpendCFD,
    listClosedCFDs,
    getClosedCFD,
    connect,
    signServiceTerm,
    disconnect,
    getBalance,
    getWalletBalance,
    createOrder,
    closeOrder,
    updateOrder,
    deposit,
    withdraw,
    listHistories,
    sendEmailCode,
    connectEmail,
    toggleEmailNotification,
    subscribeNewsletters,
    connectTideBit,
    shareTradeRecord,
    readNotifications,
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
