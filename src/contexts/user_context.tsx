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
  defaultResultFailed,
  defaultResultSuccess,
  IResult,
} from '../interfaces/tidebit_defi_background/result';
import {
  dummyWalletBalance_BTC,
  dummyWalletBalance_ETH,
  dummyWalletBalance_USDT,
  IWalletBalance,
} from '../interfaces/tidebit_defi_background/wallet_balance';
import {getDummyBalances, IBalance} from '../interfaces/tidebit_defi_background/balance';
import {
  dummyClosedCFDOrder,
  dummyDepositOrder,
  dummyOpenCFDOrder,
  dummyWithdrawalOrder,
  IOrder,
} from '../interfaces/tidebit_defi_background/order';

import {INotificationItem} from '../interfaces/tidebit_defi_background/notification_item';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {IOrderState, OrderState} from '../constants/order_state';
import {IModifyType, ModifyType} from '../constants/modify_type';
import {IOrderType, OrderType} from '../constants/order_type';
import {WorkerContext} from './worker_context';
import ServiceTerm from '../constants/contracts/service_term';
import {IApplyCreateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyCloseCFDOrderData} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import TransactionEngineInstance from '../lib/engines/transaction_engine';
import {CFDOrderType} from '../constants/cfd_order_type';
import {IApplyCFDOrder} from '../interfaces/tidebit_defi_background/apply_cfd_order';
import {getDummyAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {dummyAcceptedDepositOrder} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {dummyAcceptedWithdrawOrder} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {IApplyDepositOrder} from '../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../interfaces/tidebit_defi_background/apply_withdraw_order';
import {Code, Reason} from '../constants/code';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomArray(min: number, max: number, length: number) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(randomNumber(min, max));
  }
  return arr;
}

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
  connect: () => Promise<IResult>;
  signServiceTerm: () => Promise<IResult>;
  disconnect: () => Promise<IResult>;
  addFavorites: (props: string) => Promise<IResult>;
  removeFavorites: (props: string) => Promise<IResult>;
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
  createCFDOrder: (props: IApplyCreateCFDOrderData | undefined) => Promise<IResult>;
  closeCFDOrder: (props: IApplyCloseCFDOrderData | undefined) => Promise<IResult>;
  updateCFDOrder: (props: IApplyUpdateCFDOrderData | undefined) => Promise<IResult>;
  deposit: (props: IApplyDepositOrder) => Promise<IResult>;
  withdraw: (props: IApplyWithdrawOrder) => Promise<IResult>;
  listHistories: (props: string) => Promise<IResult>;
  sendEmailCode: (email: string, hashCash: string) => Promise<IResult>;
  connectEmail: (email: string, code: number) => Promise<IResult>;
  toggleEmailNotification: (props: boolean) => Promise<IResult>;
  subscribeNewsletters: (props: boolean) => Promise<IResult>;
  connectTideBit: (email: string, password: string) => Promise<IResult>;
  shareTradeRecord: (tradeId: string) => Promise<IResult>;
  readNotifications: (notifications: INotificationItem[]) => Promise<IResult>;
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
  connect: () => Promise.resolve(defaultResultSuccess),
  signServiceTerm: () => Promise.resolve(defaultResultSuccess),
  disconnect: () => Promise.resolve(defaultResultSuccess),
  addFavorites: () => Promise.resolve(defaultResultSuccess),
  removeFavorites: () => Promise.resolve(defaultResultSuccess),
  listOpenCFDs: () => Promise.resolve<IOpenCFDDetails[]>([]),
  listClosedCFDs: () => Promise.resolve<IClosedCFDDetails[]>([]),
  // getOpendCFD: (props: string) => Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails),
  // getClosedCFD: (props: string) => Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails),
  getOpendCFD: () => dummyOpenCFDDetails,
  getClosedCFD: () => dummyCloseCFDDetails,

  // TODO:
  histories: [],
  balances: null,
  email: null,
  isSubscibedNewsletters: false,
  isEnabledEmailNotification: false,
  isConnectedWithEmail: false,
  isConnectedWithTideBit: false,
  getBalance: () => null,
  getWalletBalance: () => null,
  createCFDOrder: () => Promise.resolve<IResult>(defaultResultSuccess),
  closeCFDOrder: () => Promise.resolve<IResult>(defaultResultSuccess),
  updateCFDOrder: () => Promise.resolve<IResult>(defaultResultSuccess),
  deposit: () => Promise.resolve<IResult>(defaultResultSuccess),
  withdraw: () => Promise.resolve<IResult>(defaultResultSuccess),
  listHistories: () => Promise.resolve(defaultResultSuccess),
  sendEmailCode: () => Promise.resolve(defaultResultSuccess),
  connectEmail: () => Promise.resolve(defaultResultSuccess),
  toggleEmailNotification: () => Promise.resolve(defaultResultSuccess),
  subscribeNewsletters: () => Promise.resolve(defaultResultSuccess),
  connectTideBit: () => Promise.resolve(defaultResultSuccess),
  shareTradeRecord: () => Promise.resolve(defaultResultSuccess),
  readNotifications: () => Promise.resolve(defaultResultSuccess),
  init: () => Promise.resolve(),
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const transactionEngine = React.useMemo(() => TransactionEngineInstance, []);
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
    // ++ TODO fetch user favorite tickers
    setFavoriteTickers(['ETH', 'BTC']);
    await listHistories();
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
    setFavoriteTickers([]);
    notificationCtx.emitter.emit(TideBitEvent.DISCONNECTED);
  };

  const lunar = Lunar.getInstance();
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
    let result: IResult = defaultResultFailed;
    result.code = Code.WALLET_IS_NOT_CONNECT;
    result.reason = Reason[result.code];
    try {
      const connect = await lunar.connect({});
      if (connect && lunar.isConnected) {
        result = {
          success: true,
          code: Code.SUCCESS,
        };
      }
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };

  const signServiceTerm = async (): Promise<IResult> => {
    let eip712signature: string,
      result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      eip712signature = await lunar.signTypedData(ServiceTerm);
      const verifyR: boolean = lunar.verifyTypedData(ServiceTerm, eip712signature);
      if (verifyR) {
        // ++ TODO to checksum address
        setEnableServiceTerm(true);
        await setPrivateData(lunar.address);
        result = {
          success: true,
          code: Code.SUCCESS,
        };
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return signServiceTerm();
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        result.reason = Reason[result.code];
        return result;
      }
    }
  };

  const disconnect = async () => {
    let result: IResult = defaultResultFailed;
    try {
      await lunar.disconnect();
      if (!lunar.isConnected) {
        result = {
          success: true,
          code: Code.SUCCESS,
        };
      }
    } catch (error) {}
    return result;
  };

  const addFavorites = async (newFavorite: string) => {
    let result: IResult = defaultResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      // console.log(`userContext updatedFavoriteTickers`, updatedFavoriteTickers);
      result = defaultResultSuccess;
    }
    return result;
  };

  const removeFavorites = async (previousFavorite: string) => {
    let result: IResult = defaultResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(
        currency => currency === previousFavorite
      );
      if (index !== -1) updatedFavoriteTickers.splice(index, 1);
      setFavoriteTickers(updatedFavoriteTickers);
      // console.log(`userContext updatedFavoriteTickers`, updatedFavoriteTickers);
      result = defaultResultSuccess;
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

  const createCFDOrder = async (props: IApplyCreateCFDOrderData | undefined): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (props) {
        const balance: IBalance | null = getBalance(props.margin.asset);
        if (balance && balance.available >= props.margin.amount) {
          const CFDOrder: IApplyCFDOrder = {
            type: CFDOrderType.CREATE,
            data: props,
          };
          const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            CFDOrder.signature = signature;
            // ++ API send transaction
            result = {
              success: true,
              code: Code.SUCCESS,
              data: getDummyAcceptedCFDOrder(props.ticker),
            };
          }
        }
      }
      return await Promise.resolve<IResult>(result);
    } else {
      const isConnected = await connect();
      if (isConnected) return createCFDOrder(props);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const closeCFDOrder = async (props: IApplyCloseCFDOrderData | undefined): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (props) {
        const CFDOrder: IApplyCFDOrder = {type: CFDOrderType.CLOSE, data: props};
        const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
        if (transferR.success) {
          const ticker: string | undefined = openCFDs.find(o => o.id === props.orderId)?.ticker;
          // ++  if(order is live)
          const signature: string = await lunar.signTypedData(transferR.data);
          CFDOrder.signature = signature;
          // ++ API send transaction
          if (ticker)
            result = {
              success: true,
              code: Code.SUCCESS,
              data: getDummyAcceptedCFDOrder(ticker),
            };
        }
      }
      return await Promise.resolve<IResult>(result);
    } else {
      const isConnected = await connect();
      if (isConnected) return closeCFDOrder(props);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const updateCFDOrder = async (props: IApplyUpdateCFDOrderData | undefined): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (props) {
        const CFDOrder: IApplyCFDOrder = {type: CFDOrderType.UPDATE, data: props};
        const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
        if (transferR.success) {
          const ticker: string | undefined = openCFDs.find(o => o.id === props.orderId)?.ticker;
          // ++  if(order is live)
          const signature: string = await lunar.signTypedData(transferR.data);
          CFDOrder.signature = signature;
          // ++ API send transaction
          if (ticker)
            result = {
              success: true,
              code: Code.SUCCESS,
              data: getDummyAcceptedCFDOrder(ticker),
            };
        }
      }
      return await Promise.resolve<IResult>(result);
    } else {
      const isConnected = await connect();
      if (isConnected) return updateCFDOrder(props);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const deposit = async (depositOrder: IApplyDepositOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      const walletBalance: IWalletBalance | null = getWalletBalance(depositOrder.targetAsset);
      // if (walletBalance && walletBalance.balance >= depositOrder.targetAmount) { // ++ TODO verify
      const transaction: {to: string; amount: number; data: string} =
        transactionEngine.transferDepositOrderToTransaction(depositOrder);
      const sendR = await lunar.send(transaction);
      // TODO: updateWalletBalances
      result = {
        success: true,
        code: Code.SUCCESS,
        data: dummyAcceptedDepositOrder,
      };
      // }
      return await Promise.resolve<IResult>(result);
    } else {
      const isConnected = await connect();
      if (isConnected) return deposit(depositOrder);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const withdraw = async (witherOrder: IApplyWithdrawOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      const balance: IBalance | null = getBalance(witherOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= witherOrder.targetAmount) {
        // TODO: balance.available > ?
        // TODO: OrderEngine create withdraw order data
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(witherOrder);
        if (transferR.success) {
          // ++  if(order is live)
          const signature: string = await lunar.signTypedData(transferR.data);
          witherOrder.signature = signature;
          // ++ API send transaction
          result = {
            success: true,
            code: Code.SUCCESS,
            data: dummyAcceptedWithdrawOrder,
          };
        }
      }
      return await Promise.resolve<IResult>(result);
    } else {
      const isConnected = await connect();
      if (isConnected) return withdraw(witherOrder);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const listHistories = async () => {
    let histories: IOrder[] = [],
      result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      // TODO: getHistories from backend
      histories = [dummyDepositOrder, dummyClosedCFDOrder, dummyOpenCFDOrder, dummyWithdrawalOrder];
      setHistories(histories);
      result = defaultResultSuccess;
      result.data = histories;
    }
    return result;
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

  const sendEmailCode = async (email: string, hashCash: string) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  const connectEmail = async (email: string, code: number) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  const toggleEmailNotification = async (props: boolean) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  const subscribeNewsletters = async (props: boolean) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  const connectTideBit = async (email: string, password: string) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };
  const shareTradeRecord = async (tradeId: string) => {
    let result: IResult = defaultResultFailed;
    try {
      // TODO: call 3rd party api (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = defaultResultFailed;
    }
    return result;
  };

  const readNotifications = async (notifications: INotificationItem[]) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        // TODO: post request (Tzuhan - 20230317)
        result = defaultResultSuccess;
        notificationCtx.emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, notifications);
      } catch (error) {
        result = defaultResultFailed;
      }
    }

    return result;
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
    createCFDOrder,
    closeCFDOrder,
    updateCFDOrder,
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
