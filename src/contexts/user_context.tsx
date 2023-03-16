import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext} from 'react';
import useState from 'react-usestateref';
import {TypeOfPnLColorHex} from '../constants/display';
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
import {getDummyBalances, IBalance} from '../interfaces/tidebit_defi_background/balance';
import {INotificationItem} from '../interfaces/tidebit_defi_background/notification_item';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {OrderState} from '../constants/order_state';
import {OrderType} from '../constants/order_type';
import {WorkerContext} from './worker_context';
import ServiceTerm from '../constants/contracts/service_term';
import {IApplyCreateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyCloseCFDOrderData} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import TransactionEngineInstance from '../classes/transaction_engine';
import {CFDOrderType} from '../constants/cfd_order_type';
import {
  convertApplyCloseCFDToAcceptedCFD,
  convertApplyCreateCFDToAcceptedCFD,
  convertApplyUpdateCFDToAcceptedCFD,
  IApplyCFDOrder,
} from '../interfaces/tidebit_defi_background/apply_cfd_order';
import {
  getDummyAcceptedCFDOrder,
  IAcceptedCFDOrder,
} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {IOrderResult} from '../interfaces/tidebit_defi_background/order_result';
import {
  convertApplyDepositOrderToAcceptedDepositOrder,
  IApplyDepositOrder,
} from '../interfaces/tidebit_defi_background/apply_deposit_order';
import {
  convertApplyWithdrawOrderToAcceptedWithdrawOrder,
  IApplyWithdrawOrder,
} from '../interfaces/tidebit_defi_background/apply_withdraw_order';
import {IAcceptedOrder} from '../interfaces/tidebit_defi_background/accepted_order';
import {
  getDummyAcceptedWithdrawOrder,
  IAcceptedWithdrawOrder,
} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {
  getDummyAcceptedDepositOrder,
  IAcceptedDepositOrder,
} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {APIRequest, Method} from '../constants/api_request';
import SafeMath from '../lib/safe_math';
import {OrderStatusUnion} from '../constants/order_status_union';

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
  openCFDs: IAcceptedCFDOrder[];
  closedCFDs: IAcceptedCFDOrder[];
  connect: () => Promise<boolean>;
  signServiceTerm: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  addFavorites: (props: string) => IResult;
  removeFavorites: (props: string) => IResult;
  listCFDs: (props: string) => Promise<void>;
  getOpendCFD: (props: string) => IAcceptedCFDOrder;
  getClosedCFD: (props: string) => IAcceptedCFDOrder;

  // TODO:
  histories: IAcceptedOrder[];
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
  listHistories: (props: string) => Promise<IAcceptedOrder[]>;
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
  listCFDs: (props: string) => Promise.resolve(),
  getOpendCFD: (props: string) => getDummyAcceptedCFDOrder('ETH', OrderState.OPENING),
  getClosedCFD: (props: string) => getDummyAcceptedCFDOrder('ETH', OrderState.CLOSED),

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
  createCFDOrder: (props: IApplyCreateCFDOrderData | undefined) =>
    Promise.resolve<IResult>(dummyResultSuccess),
  closeCFDOrder: (props: IApplyCloseCFDOrderData | undefined) =>
    Promise.resolve<IResult>(dummyResultSuccess),
  updateCFDOrder: (props: IApplyUpdateCFDOrderData | undefined) =>
    Promise.resolve<IResult>(dummyResultSuccess),
  deposit: IApplyDepositOrder => Promise.resolve<IResult>(dummyResultSuccess),
  withdraw: IApplyWithdrawOrder => Promise.resolve<IResult>(dummyResultSuccess),
  listHistories: () => Promise.resolve<IAcceptedOrder[]>([]),
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
  const [histories, setHistories, historiesRef] = useState<IAcceptedOrder[]>([]);
  const [openCFDs, setOpenedCFDs, openCFDsRef] = useState<Array<IAcceptedCFDOrder>>([]);
  const [closedCFDs, setClosedCFDs, closedCFDsRef] = useState<Array<IAcceptedCFDOrder>>([]);
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
      listCFDs(selectedTickerRef.current.currency);
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

  const listCFDs = useCallback(async (props: string) => {
    if (enableServiceTermRef.current) {
      workerCtx.requestHandler({
        name: APIRequest.LIST_OPEN_CFDS,
        request: {
          name: APIRequest.LIST_OPEN_CFDS,
          method: Method.GET,
          url: `/api/cfds/${props}`,
        },
        callback: (CFDs: IAcceptedCFDOrder[]) => {
          let openCFDs: IAcceptedCFDOrder[] = [];
          let closedCFDs: IAcceptedCFDOrder[] = [];
          for (const order of CFDs) {
            switch (order.state) {
              case OrderState.OPENING:
              case OrderState.FREEZED:
                openCFDs = openCFDs.concat(order);
                break;
              case OrderState.CLOSED:
                closedCFDs = closedCFDs.concat(order);
                break;
              default:
                break;
            }
          }
          setOpenedCFDs(openCFDs);
          setClosedCFDs(closedCFDs);
        },
      });
    }
  }, []);

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

  const signServiceTerm = async (): Promise<boolean> => {
    let eip712signature: string,
      result = false;
    if (lunar.isConnected) {
      eip712signature = await lunar.signTypedData(ServiceTerm);
      const verifyR: boolean = lunar.verifyTypedData(ServiceTerm, eip712signature);
      if (verifyR) {
        // ++ TODO to checksum address
        setEnableServiceTerm(true);
        await setPrivateData(lunar.address);
        result = true;
      }
      return result;
    } else {
      await connect();
      return signServiceTerm();
    }
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

  const getOpendCFD = (id: string) =>
    openCFDs.find(o => o.id === id) ||
    getDummyAcceptedCFDOrder(selectedTickerRef.current?.currency, OrderState.OPENING);

  const getClosedCFD = (id: string) =>
    closedCFDs.find(o => o.id === id) ||
    getDummyAcceptedCFDOrder(selectedTickerRef.current?.currency, OrderState.CLOSED);

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

  const updateBalance = (data: {currency: string; available: number; locked: number}) => {
    if (balancesRef.current) {
      const index = balancesRef.current?.findIndex(balance => balance.currency);
      if (index !== -1) {
        const balance = balancesRef.current[index];
        const updateBalance: IBalance = {
          ...balance,
          available: SafeMath.plus(balance.available, data.available),
          locked: SafeMath.plus(balance.locked, data.locked),
        };
        const updateBalances = [...balancesRef.current];
        updateBalances[index] = updateBalance;
        setBalances(updateBalances);
      }
    }
  };

  const createCFDOrder = async (props: IApplyCreateCFDOrderData | undefined): Promise<IResult> => {
    if (lunar.isConnected) {
      let result: IOrderResult = dummyResultFailed;
      if (props) {
        const balance: IBalance | null = getBalance(props.margin.asset);
        if (balance && balance.available >= props.margin.amount) {
          const CFDOrder: IApplyCFDOrder = {
            orderType: OrderType.CFD,
            type: CFDOrderType.CREATE,
            data: props,
          };
          const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            if (signature) {
              CFDOrder.signature = signature;
              const acceptedCFDOrder: IAcceptedCFDOrder = convertApplyCreateCFDToAcceptedCFD(props);
              updateHistories([acceptedCFDOrder]);
              updateBalance({
                currency: props.margin.asset,
                available: -props.margin.amount,
                locked: props.margin.amount,
              });
              workerCtx.requestHandler({
                name: APIRequest.CREATE_CFD,
                request: {
                  name: APIRequest.CREATE_CFD,
                  method: Method.POST,
                  url: `/api/cfds/${props.ticker}`,
                  body: props,
                },
                callback: (result: {success: boolean}) => {
                  if (result.success)
                    updateHistories([
                      {...acceptedCFDOrder, orderStatus: OrderStatusUnion.PROCESSING},
                    ]);
                  else
                    updateHistories([{...acceptedCFDOrder, orderStatus: OrderStatusUnion.FAILED}]);
                  // eslint-disable-next-line no-console
                  console.log(`after createCFDOrder historiesRef.current`, historiesRef.current);
                },
              });
              result = {
                success: true,
                data: acceptedCFDOrder,
              };
            }
          }
        }
      }
      return await Promise.resolve<IOrderResult>(result);
    } else {
      await connect();
      return createCFDOrder(props);
    }
  };

  const closeCFDOrder = async (
    props: IApplyCloseCFDOrderData | undefined
  ): Promise<IOrderResult> => {
    if (lunar.isConnected) {
      let result: IOrderResult = dummyResultFailed;
      if (props) {
        const openCFD = openCFDs.find(o => o.id === props.orderId);
        if (openCFD && openCFD.state === OrderState.OPENING) {
          const CFDOrder: IApplyCFDOrder = {
            orderType: OrderType.CFD,
            type: CFDOrderType.CLOSE,
            data: props,
          };
          const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            if (signature) {
              CFDOrder.signature = signature;
              const acceptedCFDOrder: IAcceptedCFDOrder = convertApplyCloseCFDToAcceptedCFD(
                props,
                openCFD
              );
              updateHistories([acceptedCFDOrder]);
              workerCtx.requestHandler({
                name: APIRequest.CLOSE_CFD,
                request: {
                  name: APIRequest.CLOSE_CFD,
                  method: Method.POST,
                  url: `/api/cfds/${openCFD.ticker}`,
                  body: props,
                },
                callback: (result: {success: boolean}) => {
                  if (result.success)
                    updateHistories([
                      {...acceptedCFDOrder, orderStatus: OrderStatusUnion.PROCESSING},
                    ]);
                  else
                    updateHistories([{...acceptedCFDOrder, orderStatus: OrderStatusUnion.FAILED}]);
                  // eslint-disable-next-line no-console
                  console.log(`after closeCFDOrder historiesRef.current`, historiesRef.current);
                },
              });
              result = {
                success: true,
                data: acceptedCFDOrder,
              };
            }
          }
        }
      }
      return await Promise.resolve<IOrderResult>(result);
    } else {
      await connect();
      return closeCFDOrder(props);
    }
  };

  const updateCFDOrder = async (
    props: IApplyUpdateCFDOrderData | undefined
  ): Promise<IOrderResult> => {
    if (lunar.isConnected) {
      let result: IOrderResult = dummyResultFailed;
      if (props) {
        const openCFD = openCFDs.find(o => o.id === props.orderId);
        if (openCFD && openCFD.state === OrderState.OPENING) {
          const CFDOrder: IApplyCFDOrder = {
            orderType: OrderType.CFD,
            type: CFDOrderType.UPDATE,
            data: props,
          };
          const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            if (signature) {
              CFDOrder.signature = signature;
              const acceptedCFDOrder: IAcceptedCFDOrder = convertApplyUpdateCFDToAcceptedCFD(
                props,
                openCFD
              );
              updateHistories([acceptedCFDOrder]);
              workerCtx.requestHandler({
                name: APIRequest.UPDATE_CFD,
                request: {
                  name: APIRequest.UPDATE_CFD,
                  method: Method.POST,
                  url: `/api/cfds/${openCFD.ticker}`,
                  body: props,
                },
                callback: (result: {success: boolean}) => {
                  if (result.success)
                    updateHistories([
                      {...acceptedCFDOrder, orderStatus: OrderStatusUnion.PROCESSING},
                    ]);
                  else
                    updateHistories([{...acceptedCFDOrder, orderStatus: OrderStatusUnion.FAILED}]);
                  // eslint-disable-next-line no-console
                  console.log(`after updateCFDOrder historiesRef.current`, historiesRef.current);
                },
              });
              result = {
                success: true,
                data: acceptedCFDOrder,
              };
            }
          }
        }
      }
      return await Promise.resolve<IOrderResult>(result);
    } else {
      await connect();
      return updateCFDOrder(props);
    }
  };

  const deposit = async (depositOrder: IApplyDepositOrder): Promise<IOrderResult> => {
    let result: IOrderResult = dummyResultFailed;
    if (lunar.isConnected) {
      const walletBalance: IWalletBalance | null = getWalletBalance(depositOrder.targetAsset);
      if (walletBalance && walletBalance.balance >= depositOrder.targetAmount) {
        const transaction: {to: string; amount: number; data: string} =
          transactionEngine.transferDepositOrderToTransaction(depositOrder);
        const sendResult = await lunar.send(transaction);
        // ++TODO handle sendResult
        updateBalance({
          currency: depositOrder.targetAsset,
          available: depositOrder.targetAmount,
          locked: 0,
        });
        const acceptedDepositOrder: IAcceptedDepositOrder =
          convertApplyDepositOrderToAcceptedDepositOrder(depositOrder);
        updateHistories([acceptedDepositOrder]);
        // eslint-disable-next-line no-console
        console.log(`after deposit historiesRef.current`, historiesRef.current);
        result = {
          success: true,
          data: acceptedDepositOrder,
        };
      }
      return await Promise.resolve<IOrderResult>(result);
    } else {
      await connect();
      return deposit(depositOrder);
    }
  };

  const withdraw = async (withdrawOrder: IApplyWithdrawOrder): Promise<IOrderResult> => {
    let result: IOrderResult = dummyResultFailed;
    if (lunar.isConnected) {
      const balance: IBalance | null = getBalance(withdrawOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= withdrawOrder.targetAmount) {
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(withdrawOrder);
        if (transferR.success) {
          const signature: string = await lunar.signTypedData(transferR.data);
          if (signature) {
            withdrawOrder.signature = signature;
            const acceptedWithdrawOrder: IAcceptedWithdrawOrder =
              convertApplyWithdrawOrderToAcceptedWithdrawOrder(withdrawOrder);
            updateHistories([acceptedWithdrawOrder]);
            workerCtx.requestHandler({
              name: APIRequest.WITHDRAW,
              request: {
                name: APIRequest.WITHDRAW,
                method: Method.POST,
                url: `/api/withdraws/${withdrawOrder.targetAsset}`,
                body: withdrawOrder,
              },
              callback: (result: {success: boolean}) => {
                if (result.success)
                  updateHistories([
                    {...acceptedWithdrawOrder, orderStatus: OrderStatusUnion.PROCESSING},
                  ]);
                else
                  updateHistories([
                    {...acceptedWithdrawOrder, orderStatus: OrderStatusUnion.FAILED},
                  ]);
                // eslint-disable-next-line no-console
                console.log(`after withdraw historiesRef.current`, historiesRef.current);
              },
            });
            result = {
              success: true,
              data: acceptedWithdrawOrder, // ++ TODO remove dummy ticker
            };
          }
        }
      }
      return await Promise.resolve<IOrderResult>(result);
    } else {
      await connect();
      return withdraw(withdrawOrder);
    }
  };

  const listHistories = async () => {
    let histories: IAcceptedOrder[] = [];
    if (isConnectedRef) {
      // TODO: getHistories from backend
      histories = [
        getDummyAcceptedDepositOrder(selectedTickerRef.current?.currency),
        getDummyAcceptedCFDOrder(selectedTickerRef.current?.currency),
        getDummyAcceptedWithdrawOrder(selectedTickerRef.current?.currency),
      ];
      setHistories(histories);
    }
    return histories;
  };

  const updateHistories = (updatedOrders: IAcceptedOrder[]) => {
    interface IOrderData {
      [key: string]: IAcceptedOrder;
    }
    const histories = [...historiesRef.current];
    const CFDs: IOrderData = {};
    const deposits: IOrderData = {};
    const withdraws: IOrderData = {};
    for (const order of histories) {
      switch (order.orderType) {
        case OrderType.CFD:
          if (!CFDs[order.id]) CFDs[order.id] = {...order};
          break;
        case OrderType.DEPOSIT:
          if (!deposits[order.id]) deposits[order.id] = {...order};
          break;
        case OrderType.WITHDRAW:
          if (!withdraws[order.id]) withdraws[order.id] = {...order};
          break;
        // case OrderType.SPOT: // -- current is not support SPOT order
        // break;
        default:
          break;
      }
    }
    for (const updatedOrder of updatedOrders) {
      switch (updatedOrder.orderType) {
        case OrderType.CFD:
          CFDs[updatedOrder.id] = {...updatedOrder};
          break;
        case OrderType.DEPOSIT:
          deposits[updatedOrder.id] = {...updatedOrder};
          break;
        case OrderType.WITHDRAW:
          withdraws[updatedOrder.id] = {...updatedOrder};
          break;
        // case OrderType.SPOT: // -- current is not support SPOT order
        // break;
        default:
          break;
      }
    }
    let updateOpenCFDs: IAcceptedCFDOrder[] = [];
    let updateCloseCFDs: IAcceptedCFDOrder[] = [];
    (Object.values(CFDs) as IAcceptedCFDOrder[]).forEach(order => {
      switch (order.state) {
        case OrderState.OPENING:
        case OrderState.FREEZED:
          updateOpenCFDs = updateOpenCFDs.concat(order);
          break;
        case OrderState.CLOSED:
          updateCloseCFDs = updateCloseCFDs.concat(order);
          break;
        default:
          break;
      }
    });
    updateOpenCFDs = updateOpenCFDs.sort((a, b) => b.createTimestamp - a.createTimestamp);
    updateCloseCFDs = updateCloseCFDs.sort((a, b) => b.createTimestamp - a.createTimestamp);
    const updateHistories = Object.values(CFDs)
      .concat(Object.values(deposits))
      .concat(Object.values(withdraws))
      .sort((a, b) => b.createTimestamp - a.createTimestamp);
    setOpenedCFDs(updateOpenCFDs);
    setClosedCFDs(updateCloseCFDs);
    setHistories(updateHistories);
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
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.ORDER, updateHistories), []);
  React.useMemo(
    () => notificationCtx.emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS, readNotifications),
    []
  );
  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, (ticker: ITickerData) => {
        setSelectedTicker(ticker);
        listCFDs(ticker.currency);
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
    listCFDs,
    getOpendCFD,
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
