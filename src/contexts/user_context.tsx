import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext} from 'react';
import useState from 'react-usestateref';
import {TypeOfPnLColorHex} from '../constants/display';
import {
  dummyResultFailed,
  IResult,
  dummyResultSuccess,
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
import {OrderState} from '../constants/order_state';
import {OrderType} from '../constants/order_type';
import {WorkerContext} from './worker_context';
import ServiceTerm from '../constants/contracts/service_term';
import {IApplyCreateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyCloseCFDOrderData} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import TransactionEngineInstance from '../lib/engines/transaction_engine';
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
import {APIName, APIRequest, Method} from '../constants/api_request';
import SafeMath from '../lib/safe_math';
import {OrderStatusUnion} from '../constants/order_status_union';
import {Code, Reason} from '../constants/code';
import {
  getDummyDisplayAcceptedCFDOrder,
  IDisplayAcceptedCFDOrder,
} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';

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
  balances: IBalance[] | null;
  favoriteTickers: string[];
  isConnected: boolean;
  enableServiceTerm: boolean;
  email: string | null;
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  openCFDs: IDisplayAcceptedCFDOrder[];
  closedCFDs: IDisplayAcceptedCFDOrder[];
  deposits: IAcceptedDepositOrder[];
  withdraws: IAcceptedWithdrawOrder[];
  histories: IOrder[];
  connect: () => Promise<IResult>;
  signServiceTerm: () => Promise<IResult>;
  disconnect: () => Promise<IResult>;
  addFavorites: (props: string) => Promise<IResult>;
  removeFavorites: (props: string) => Promise<IResult>;
  listHistories: (props: string) => Promise<IResult>; // TODO: result.data: IOrder[] (20230323 - tzuhan)
  listCFDs: (props: string) => Promise<IResult>; // TODO: result.data: IAcceptedCFDOrder[] (20230323 - tzuhan)
  getCFD: (props: string) => IDisplayAcceptedCFDOrder;
  createCFDOrder: (props: IApplyCreateCFDOrderData | undefined) => Promise<IResult>;
  closeCFDOrder: (props: IApplyCloseCFDOrderData | undefined) => Promise<IResult>;
  updateCFDOrder: (props: IApplyUpdateCFDOrderData | undefined) => Promise<IResult>;
  listDeposits: (props: string) => Promise<IResult>; // TODO: result.data: IAcceptedDepositOrder[] (20230323 - tzuhan)
  deposit: (props: IApplyDepositOrder) => Promise<IResult>;
  listWithdraws: (props: string) => Promise<IResult>; // TODO: result.data: IAcceptedWithdrawOrder[] (20230323 - tzuhan)
  withdraw: (props: IApplyWithdrawOrder) => Promise<IResult>;
  sendEmailCode: (email: string, hashCash: string) => Promise<IResult>;
  connectEmail: (email: string, code: number) => Promise<IResult>;
  toggleEmailNotification: (props: boolean) => Promise<IResult>;
  subscribeNewsletters: (props: boolean) => Promise<IResult>;
  connectTideBit: (email: string, password: string) => Promise<IResult>;
  shareTradeRecord: (tradeId: string) => Promise<IResult>;
  readNotifications: (notifications: INotificationItem[]) => Promise<IResult>;
  getBalance: (props: string) => IBalance | null;
  getWalletBalance: (props: string) => IWalletBalance | null;
  init: () => Promise<void>;
}

export const UserContext = createContext<IUserContext>({
  id: null,
  username: null,
  wallet: null,
  walletBalances: null,
  balance: null,
  balances: null,
  favoriteTickers: [],
  isConnected: false,
  enableServiceTerm: false,
  email: null,
  isSubscibedNewsletters: false,
  isEnabledEmailNotification: false,
  isConnectedWithEmail: false,
  isConnectedWithTideBit: false,
  openCFDs: [],
  closedCFDs: [],
  deposits: [],
  withdraws: [],
  histories: [],
  connect: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  signServiceTerm: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  disconnect: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  addFavorites: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  removeFavorites: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  listHistories: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  listCFDs: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  getCFD: () => getDummyDisplayAcceptedCFDOrder('ETH'),
  createCFDOrder: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  closeCFDOrder: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  updateCFDOrder: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  listDeposits: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  deposit: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  listWithdraws: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  withdraw: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  sendEmailCode: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  connectEmail: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  toggleEmailNotification: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  subscribeNewsletters: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  connectTideBit: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  shareTradeRecord: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  readNotifications: (): Promise<IResult> => {
    throw new Error('Function not implemented.');
  },
  getBalance: () => null,
  getWalletBalance: () => null,
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
  const [openCFDs, setOpenedCFDs, openCFDsRef] = useState<Array<IDisplayAcceptedCFDOrder>>([]);
  const [closedCFDs, setClosedCFDs, closedCFDsRef] = useState<Array<IDisplayAcceptedCFDOrder>>([]);
  const [deposits, setDeposits, depositsRef] = useState<Array<IAcceptedDepositOrder>>([]);
  const [withdraws, setWithdraws, withdrawsRef] = useState<Array<IAcceptedWithdrawOrder>>([]);
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

  const listCFDs = useCallback(async (props: string) => {
    let result: IResult = dummyResultFailed;
    if (enableServiceTermRef.current) {
      workerCtx.requestHandler({
        name: APIName.LIST_CFD_TRADES,
        method: Method.GET,
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
          // TODO: add convert IAcceptedCFDOrder to IDisplayAcceptedCFDOrder (20230323 - tzuhan)
          // setOpenedCFDs(openCFDs);
          // setClosedCFDs(closedCFDs);
        },
      });
      result = dummyResultSuccess;
    }
    return result;
  }, []);

  const listDeposits = useCallback(async (props: string) => {
    let result: IResult = dummyResultFailed;
    if (enableServiceTermRef.current) {
      workerCtx.requestHandler({
        name: APIName.LIST_DEPOSIT_TRADES,
        method: Method.GET,
        callback: (deposits: IAcceptedDepositOrder[]) => {
          setDeposits(deposits);
        },
      });
      result = dummyResultSuccess;
    }
    return result;
  }, []);

  const listWithdraws = useCallback(async (props: string) => {
    let result: IResult = dummyResultFailed;
    if (enableServiceTermRef.current) {
      workerCtx.requestHandler({
        name: APIName.LIST_DEPOSIT_TRADES,
        method: Method.GET,
        callback: (withdraws: IAcceptedWithdrawOrder[]) => {
          setWithdraws(withdraws);
        },
      });
      result = dummyResultSuccess;
    }
    return result;
  }, []);

  const connect = async () => {
    let result: IResult = dummyResultFailed;
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
      result = dummyResultFailed;
    }
    return result;
  };

  const signServiceTerm = async (): Promise<IResult> => {
    let eip712signature: string,
      result: IResult = dummyResultFailed;
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
    let result: IResult = dummyResultFailed;
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

  const removeFavorites = async (previousFavorite: string) => {
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

  const getCFD = (id: string) =>
    openCFDs.find(o => o.id === id) ||
    getDummyDisplayAcceptedCFDOrder(selectedTickerRef.current?.currency || 'ETH');

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
    let result: IResult = dummyResultFailed;
    if (lunar.isConnected) {
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
    let result: IResult = dummyResultFailed;
    if (lunar.isConnected) {
      if (props) {
        const CFDOrder: IApplyCFDOrder = {
          type: CFDOrderType.CLOSE,
          data: props,
          orderType: 'CFD',
        };
        const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
        if (transferR.success) {
          const ticker: string | undefined = openCFDs.find(o => o.id === props.orderId)?.ticker;
          // ++  if(order is live)
          const signature: string = await lunar.signTypedData(transferR.data);
          CFDOrder.signature = signature;
          // ++ API send transaction
          result = {
            success: true,
            code: Code.SUCCESS,
            data: getDummyAcceptedCFDOrder(ticker || 'ETH'), // ++ TODO remove dummy ticker
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
    let result: IResult = dummyResultFailed;
    if (lunar.isConnected) {
      if (props) {
        const CFDOrder: IApplyCFDOrder = {
          type: CFDOrderType.UPDATE,
          data: props,
          orderType: 'CFD',
        };
        const transferR = transactionEngine.transferCFDOrderToTransaction(CFDOrder);
        if (transferR.success) {
          const ticker: string | undefined = openCFDs.find(o => o.id === props.orderId)?.ticker;
          // ++  if(order is live)
          const signature: string = await lunar.signTypedData(transferR.data);
          CFDOrder.signature = signature;
          // ++ API send transaction
          result = {
            success: true,
            code: Code.SUCCESS,
            data: getDummyAcceptedCFDOrder(ticker || 'ETH'), // ++ TODO remove dummy ticker
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
    let result: IResult = dummyResultFailed;
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
        data: getDummyAcceptedDepositOrder(depositOrder.targetAsset), // new walletBalance
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

  const withdraw = async (withdrawOrder: IApplyWithdrawOrder): Promise<IResult> => {
    let result: IResult = dummyResultFailed;
    if (lunar.isConnected) {
      const balance: IBalance | null = getBalance(withdrawOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= withdrawOrder.targetAmount) {
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(withdrawOrder);
        if (transferR.success) {
          const signature: string = await lunar.signTypedData(transferR.data);
          withdrawOrder.signature = signature;
          // ++ API send transaction
          result = {
            success: true,
            code: Code.SUCCESS,
            data: getDummyAcceptedWithdrawOrder(withdrawOrder.targetAsset), // ++ TODO remove dummy ticker
          };
        }
      }
      return await Promise.resolve<IResult>(result);
    } else {
      await connect();
      return withdraw(withdrawOrder);
    }
  };

  const listHistories = async () => {
    let histories: IOrder[] = [],
      result: IResult = dummyResultFailed;
    if (isConnectedRef) {
      // TODO: getHistories from backend
      histories = [dummyDepositOrder, dummyOpenCFDOrder, dummyClosedCFDOrder, dummyWithdrawalOrder];
      setHistories(histories);
      result = dummyResultSuccess;
      result.data = histories;
    }
    return result;
  };

  // const updateHistories = (updatedOrders: IAcceptedOrder[]) => {
  //   interface IOrderData {
  //     [key: string]: IAcceptedOrder;
  //   }
  //   const histories = [...historiesRef.current];
  //   const CFDs: IOrderData = {};
  //   const deposits: IOrderData = {};
  //   const withdraws: IOrderData = {};
  //   for (const order of histories) {
  //     switch (order.orderType) {
  //       case OrderType.CFD:
  //         if (!CFDs[order.id]) CFDs[order.id] = {...order};
  //         break;
  //       case OrderType.DEPOSIT:
  //         if (!deposits[order.id]) deposits[order.id] = {...order};
  //         break;
  //       case OrderType.WITHDRAW:
  //         if (!withdraws[order.id]) withdraws[order.id] = {...order};
  //         break;
  //       // case OrderType.SPOT: // -- current is not support SPOT order
  //       // break;
  //       default:
  //         break;
  //     }
  //   }
  //   for (const updatedOrder of updatedOrders) {
  //     switch (updatedOrder.orderType) {
  //       case OrderType.CFD:
  //         CFDs[updatedOrder.id] = {...updatedOrder};
  //         break;
  //       case OrderType.DEPOSIT:
  //         deposits[updatedOrder.id] = {...updatedOrder};
  //         break;
  //       case OrderType.WITHDRAW:
  //         withdraws[updatedOrder.id] = {...updatedOrder};
  //         break;
  //       // case OrderType.SPOT: // -- current is not support SPOT order
  //       // break;
  //       default:
  //         break;
  //     }
  //   }
  //   let updateOpenCFDs: IAcceptedCFDOrder[] = [];
  //   let updateCloseCFDs: IAcceptedCFDOrder[] = [];
  //   (Object.values(CFDs) as IAcceptedCFDOrder[]).forEach(order => {
  //     switch (order.state) {
  //       case OrderState.OPENING:
  //       case OrderState.FREEZED:
  //         updateOpenCFDs = updateOpenCFDs.concat(order);
  //         break;
  //       case OrderState.CLOSED:
  //         updateCloseCFDs = updateCloseCFDs.concat(order);
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  //   updateOpenCFDs = updateOpenCFDs.sort((a, b) => b.createTimestamp - a.createTimestamp);
  //   updateCloseCFDs = updateCloseCFDs.sort((a, b) => b.createTimestamp - a.createTimestamp);
  //   const updateHistories = Object.values(CFDs)
  //     .concat(Object.values(deposits))
  //     .concat(Object.values(withdraws))
  //     .sort((a, b) => b.createTimestamp - a.createTimestamp);
  //   setOpenedCFDs(updateOpenCFDs);
  //   setClosedCFDs(updateCloseCFDs);
  //   setHistories(updateHistories);
  // };

  const sendEmailCode = async (email: string, hashCash: string) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = dummyResultSuccess;
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };
  const connectEmail = async (email: string, code: number) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = dummyResultSuccess;
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };
  const toggleEmailNotification = async (props: boolean) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };
  const subscribeNewsletters = async (props: boolean) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };
  const connectTideBit = async (email: string, password: string) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = dummyResultSuccess;
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };
  const shareTradeRecord = async (tradeId: string) => {
    let result: IResult = dummyResultFailed;
    try {
      // TODO: call 3rd party api (Tzuhan - 20230317)
      result = dummyResultSuccess;
    } catch (error) {
      result = dummyResultFailed;
    }
    return result;
  };

  const readNotifications = async (notifications: INotificationItem[]) => {
    let result: IResult = dummyResultFailed;
    if (enableServiceTermRef.current) {
      try {
        // TODO: post request (Tzuhan - 20230317)
        result = dummyResultSuccess;
        notificationCtx.emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, notifications);
      } catch (error) {
        result = dummyResultFailed;
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
  // React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.ORDER, updateHistories), []);
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
    id: idRef.current,
    username: usernameRef.current,
    wallet: walletRef.current,
    walletBalances: walletBalancesRef.current,
    balance: balanceRef.current,
    balances: balancesRef.current,
    favoriteTickers: favoriteTickersRef.current,
    isConnected: isConnectedRef.current,
    enableServiceTerm: enableServiceTermRef.current,
    email: emailRef.current,
    isSubscibedNewsletters: isSubscibedNewslettersRef.current,
    isEnabledEmailNotification: isEnabledEmailNotificationRef.current,
    isConnectedWithEmail: isConnectedWithEmailRef.current,
    isConnectedWithTideBit: isConnectedWithTideBitRef.current,
    openCFDs: openCFDsRef.current,
    closedCFDs: closedCFDsRef.current,
    deposits: depositsRef.current,
    withdraws: withdrawsRef.current,
    histories: historiesRef.current,
    connect,
    signServiceTerm,
    disconnect,
    addFavorites,
    removeFavorites,
    listHistories,
    listCFDs,
    getCFD,
    createCFDOrder,
    closeCFDOrder,
    updateCFDOrder,
    listDeposits,
    deposit,
    listWithdraws,
    withdraw,
    sendEmailCode,
    connectEmail,
    toggleEmailNotification,
    subscribeNewsletters,
    connectTideBit,
    shareTradeRecord,
    readNotifications,
    getBalance,
    getWalletBalance,
    init,
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
