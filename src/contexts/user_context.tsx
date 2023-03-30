import keccak from '@cafeca/keccak';
import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext} from 'react';
import useState from 'react-usestateref';
import {
  defaultResultFailed,
  IResult,
  defaultResultSuccess,
} from '../interfaces/tidebit_defi_background/result';
import {
  dummyWalletBalance_BTC,
  dummyWalletBalance_ETH,
  dummyWalletBalance_USDT,
  IWalletBalance,
} from '../interfaces/tidebit_defi_background/wallet_balance';
import {IBalance} from '../interfaces/tidebit_defi_background/balance';
import {IOrder} from '../interfaces/tidebit_defi_background/order';
import {INotificationItem} from '../interfaces/tidebit_defi_background/notification_item';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {OrderState} from '../constants/order_state';
import {OrderType} from '../constants/order_type';
import {WorkerContext} from './worker_context';
import ServiceTerm from '../constants/contracts/service_term';
import {IApplyCreateCFDOrder} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyCloseCFDOrder} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyUpdateCFDOrder} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import TransactionEngineInstance from '../lib/engines/transaction_engine';
import {CFDOperation} from '../constants/cfd_order_type';
import {IApplyCFDOrder} from '../interfaces/tidebit_defi_background/apply_cfd_order';
import {IAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {IApplyDepositOrder} from '../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../interfaces/tidebit_defi_background/apply_withdraw_order';
import {IAcceptedWithdrawOrder} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {IAcceptedDepositOrder} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {APIName, Method} from '../constants/api_request';
import SafeMath from '../lib/safe_math';
import {Code, Reason} from '../constants/code';
import {
  // getDummyDisplayAcceptedCFDOrder,
  IDisplayAcceptedCFDOrder,
} from '../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {acceptedOrderToOrder, randomHex} from '../lib/common';
import TickerBookInstance from '../lib/books/ticker_book';
import {TypeOfPosition} from '../constants/type_of_position';
import {ProfitState} from '../constants/profit_state';

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
  getCFD: (props: string) => IDisplayAcceptedCFDOrder | null;
  createCFDOrder: (props: IApplyCreateCFDOrder | undefined) => Promise<IResult>;
  closeCFDOrder: (props: IApplyCloseCFDOrder | undefined) => Promise<IResult>;
  updateCFDOrder: (props: IApplyUpdateCFDOrder | undefined) => Promise<IResult>;
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
  getCFD: (): IDisplayAcceptedCFDOrder | null => {
    throw new Error('Function not implemented.');
  },
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
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const transactionEngine = React.useMemo(() => TransactionEngineInstance, []);
  const workerCtx = useContext(WorkerContext);
  const notificationCtx = useContext(NotificationContext);
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

  const setPrivateData = async (walletAddress: string) => {
    setWallet(walletAddress);
    setWalletBalances([dummyWalletBalance_BTC, dummyWalletBalance_ETH, dummyWalletBalance_USDT]);
    // TODO: getUser and User balance from backend (20230324 - tzuhan)
    setId('002');
    setUsername('Tidebit DeFi Test User');
    setBalance({
      available: 1296.47,
      locked: 583.62,
      PNL: 1956.84,
    });
    await listBalances();
    if (selectedTickerRef.current) {
      await listCFDs(selectedTickerRef.current.currency);
    }
    await listFavoriteTickers();
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

  const listFavoriteTickers = useCallback(async (address?: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const tickers = (await workerCtx.requestHandler({
          name: APIName.LIST_FAVORITE_TICKERS,
          method: Method.GET,
          // params: {
          //   address,
          // },
        })) as string[];
        setFavoriteTickers(tickers);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listFavoriteTickers error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = (error as Error).message;
      }
    }
    return result;
  }, []);

  const toDisplayAcceptedCFDOrder = (acceptedCFDOrder: IAcceptedCFDOrder) => {
    const {orderSnapshot} = acceptedCFDOrder;
    const openValue = orderSnapshot.openPrice * orderSnapshot.amount;
    const closeValue =
      orderSnapshot.state === OrderState.CLOSED && orderSnapshot.closePrice
        ? orderSnapshot.closePrice * orderSnapshot.amount
        : 0;
    const pnl =
      orderSnapshot.state === OrderState.CLOSED && orderSnapshot.closePrice
        ? (closeValue - openValue) * (orderSnapshot.typeOfPosition === TypeOfPosition.BUY ? 1 : -1)
        : 0;
    const takeProfit = orderSnapshot.typeOfPosition === TypeOfPosition.BUY ? 1.2 : 0.8;
    const stopLoss = orderSnapshot.typeOfPosition === TypeOfPosition.BUY ? 0.8 : 1.2;
    const suggestion = {
      takeProfit: orderSnapshot.openPrice * takeProfit,
      stopLoss: orderSnapshot.openPrice * stopLoss,
    };
    // TODO: to verify positionLineGraph (20230327 - tzuhan)
    // const positionLineGraph = [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10];
    const positionLineGraph: number[] = tickerBook.listTickerPositions(orderSnapshot.ticker, {
      begin: acceptedCFDOrder.createTimestamp,
    });

    const displayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
      ...acceptedCFDOrder,
      pnl: {
        type: pnl > 0 ? ProfitState.PROFIT : ProfitState.LOSS,
        value: pnl,
      },
      openValue: orderSnapshot.openPrice * orderSnapshot.amount,
      closeValue: orderSnapshot.closePrice
        ? orderSnapshot.closePrice * orderSnapshot.amount
        : undefined,
      positionLineGraph,
      suggestion,
    };
    return displayAcceptedCFDOrder;
  };

  const listCFDs = useCallback(async (ticker: string) => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        const CFDs = (await workerCtx.requestHandler({
          name: APIName.LIST_CFD_TRADES,
          method: Method.GET,
          params: {
            ticker,
          },
          /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
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
          },
          */
        })) as IAcceptedCFDOrder[];
        let openCFDs: IDisplayAcceptedCFDOrder[] = [];
        let closedCFDs: IDisplayAcceptedCFDOrder[] = [];
        for (const CFD of CFDs) {
          const displayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(CFD);
          switch (CFD.orderSnapshot.state) {
            case OrderState.OPENING:
            case OrderState.FREEZED:
              openCFDs = openCFDs.concat(displayAcceptedCFDOrder);
              break;
            case OrderState.CLOSED:
              closedCFDs = closedCFDs.concat(displayAcceptedCFDOrder);
              break;
            default:
              break;
          }
        }
        setOpenedCFDs(openCFDs);
        setClosedCFDs(closedCFDs);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listCFDs error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = (error as Error).message;
      }
    }
    return result;
  }, []);

  const listDeposits = useCallback(async (address: string) => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        const deposits = (await workerCtx.requestHandler({
          name: APIName.LIST_DEPOSIT_TRADES,
          method: Method.GET,
          params: {
            address,
          },
          /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
          callback: (deposits: IAcceptedDepositOrder[]) => {
            setDeposits(deposits);
          },
          */
        })) as IAcceptedDepositOrder[];
        setDeposits(deposits);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listDeposits error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = (error as Error).message;
      }
    }
    return result;
  }, []);

  const listWithdraws = useCallback(async (address: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const withdraws = (await workerCtx.requestHandler({
          name: APIName.LIST_DEPOSIT_TRADES,
          method: Method.GET,
          params: {
            address,
          },
          /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
        callback: (withdraws: IAcceptedWithdrawOrder[]) => {
          setWithdraws(withdraws);
        },
        */
        })) as IAcceptedWithdrawOrder[];
        setWithdraws(withdraws);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listWithdraws error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = (error as Error).message;
      }
    }
    return result;
  }, []);

  const listBalances = useCallback(async (address?: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const balances = (await workerCtx.requestHandler({
          name: APIName.LIST_BALANCES,
          method: Method.GET,
          // params: {
          //   address,
          // },
        })) as IBalance[];
        setBalances(balances);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230321)
        // eslint-disable-next-line no-console
        console.error(`listBalances error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = (error as Error).message;
      }
    }
    return result;
  }, []);

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
      (await workerCtx.requestHandler({
        name: APIName.ADD_FAVORITE_TICKERS,
        method: Method.PUT,
        body: {
          ticker: newFavorite,
          starred: true,
        },
      })) as string[];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      notificationCtx.emitter.emit(TideBitEvent.FAVORITE_TICKER, updatedFavoriteTickers);
      result = defaultResultSuccess;
    }
    return result;
  };

  const removeFavorites = async (ticker: string) => {
    let result: IResult = defaultResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(currency => currency === ticker);
      if (index !== -1) {
        (await workerCtx.requestHandler({
          name: APIName.REMOVE_FAVORITE_TICKERS,
          method: Method.PUT,
          body: {
            ticker,
            starred: false,
          },
        })) as string[];
        updatedFavoriteTickers.splice(index, 1);
      }
      setFavoriteTickers(updatedFavoriteTickers);
      notificationCtx.emitter.emit(TideBitEvent.FAVORITE_TICKER, updatedFavoriteTickers);
      result = defaultResultSuccess;
    }
    return result;
  };

  const getCFD = (id: string) => openCFDs.find(o => o.id === id) || null;

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

  const updateBalance = (balanceDiff: IBalance) => {
    // ++ TODO: verify update balance logic (20230324 - tzuhan)
    if (balancesRef.current) {
      const index = balancesRef.current?.findIndex(balance => balance.currency);
      if (index !== -1) {
        const balance = balancesRef.current[index];
        const updateBalance: IBalance = {
          ...balance,
          available: SafeMath.plus(balance.available, balanceDiff.available),
          locked: SafeMath.plus(balance.locked, balanceDiff.locked),
        };
        const updateBalances = [...balancesRef.current];
        updateBalances[index] = updateBalance;
        setBalances(updateBalances);
        return updateBalance;
      } else throw Error('Balance not found');
    } else throw Error('Balance not found');
  };

  const createCFDOrder = async (
    applyCreateCFDOrder: IApplyCreateCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (applyCreateCFDOrder) {
        const balance: IBalance | null = getBalance(applyCreateCFDOrder.margin.asset);
        if (balance && balance.available >= applyCreateCFDOrder.margin.amount) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCreateCFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            const acceptedCFDOrder = (await workerCtx.requestHandler({
              name: APIName.CREATE_CFD_TRADE,
              method: Method.POST,
              body: {applyData: applyCreateCFDOrder, balance: balance, userSignature: signature},
            })) as IAcceptedCFDOrder;
            const displayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(acceptedCFDOrder);
            setOpenedCFDs(prev => [...prev, displayAcceptedCFDOrder]);
            updateBalance(acceptedCFDOrder.balanceDifferenceCauseByOrder);
            const history: IOrder = acceptedOrderToOrder(acceptedCFDOrder);
            setHistories(prev => [...prev, history]);
            result = {
              success: true,
              code: Code.SUCCESS,
              data: history,
            };
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return createCFDOrder(applyCreateCFDOrder);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const closeCFDOrder = async (
    applyCloseCFDOrder: IApplyCloseCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (applyCloseCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyCloseCFDOrder.referenceId);
        if (index !== -1) {
          const balance: IBalance | null = getBalance(openCFDs[index].targetAsset);
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCloseCFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            const acceptedCFDOrder = (await workerCtx.requestHandler({
              name: APIName.CLOSE_CFD_TRADE,
              method: Method.PUT,
              body: {
                applyData: applyCloseCFDOrder,
                openCFD: openCFDs[index], // Deprecated: remove when backend is ready (20230424 - tzuhan)
                balance,
                userSignature: signature,
              },
            })) as IAcceptedCFDOrder;
            setOpenedCFDs(prev => [...prev].splice(index, 1));
            const displayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(acceptedCFDOrder);
            setClosedCFDs(prev => [...prev, displayAcceptedCFDOrder]);
            updateBalance(acceptedCFDOrder.balanceDifferenceCauseByOrder);
            const history: IOrder = acceptedOrderToOrder(acceptedCFDOrder);
            setHistories(prev => [...prev, history]);
            result = {
              success: true,
              code: Code.SUCCESS,
              data: history,
            };
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return closeCFDOrder(applyCloseCFDOrder);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const updateCFDOrder = async (
    applyUpdateCFDOrder: IApplyUpdateCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      if (applyUpdateCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyUpdateCFDOrder.referenceId);
        if (index !== -1) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyUpdateCFDOrder);
          if (transferR.success) {
            const signature: string = await lunar.signTypedData(transferR.data);
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            const acceptedCFDOrder = (await workerCtx.requestHandler({
              name: APIName.UPDATE_CFD_TRADE,
              method: Method.PUT,
              body: {
                applyData: applyUpdateCFDOrder,
                userSignature: signature,
                openCFD: openCFDs[index], // Deprecated: remove when backend is ready (20230424 - tzuhan)
              },
            })) as IAcceptedCFDOrder;
            const displayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(acceptedCFDOrder);
            setOpenedCFDs(prev => {
              const cfds = [...prev, displayAcceptedCFDOrder];
              cfds[index].display = false;
              return cfds;
            });
            updateBalance(acceptedCFDOrder.balanceDifferenceCauseByOrder);
            const history: IOrder = acceptedOrderToOrder(acceptedCFDOrder);
            setHistories(prev => [...prev, history]);
            result = {
              success: true,
              code: Code.SUCCESS,
              data: history,
            };
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return updateCFDOrder(applyUpdateCFDOrder);
      else {
        result.code = Code.WALLET_IS_NOT_CONNECT;
        return result;
      }
    }
  };

  const deposit = async (depositOrder: IApplyDepositOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      /** 
      * TODO: temporary comment send metamask, will uncomment (20230329 - tzuhan)
      const walletBalance: IWalletBalance | null = getWalletBalance(depositOrder.targetAsset);
      if (walletBalance && walletBalance.balance >= depositOrder.targetAmount) {
      const transaction: {to: string; amount: number; data: string} =
        transactionEngine.transferDepositOrderToTransaction(depositOrder);
      const txid = await lunar.send(transaction);
      // TODO: updateWalletBalances
      // */
      const txid = randomHex(32);
      const acceptedDepositOrder = (await workerCtx.requestHandler({
        name: APIName.CREATE_WITHDRAW_TRADE,
        method: Method.POST,
        body: {applyData: depositOrder, txid, balance: getBalance(depositOrder.targetAsset)},
      })) as IAcceptedDepositOrder;
      setDeposits(prev => [...prev, acceptedDepositOrder]);
      updateBalance(acceptedDepositOrder.balanceDifferenceCauseByOrder);
      const history: IOrder = acceptedOrderToOrder(acceptedDepositOrder);
      setHistories(prev => [...prev, history]);
      result = {
        success: true,
        code: Code.SUCCESS,
        data: history,
      };
      return result;
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
    let result: IResult = defaultResultFailed;
    if (lunar.isConnected) {
      const balance: IBalance | null = getBalance(withdrawOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= withdrawOrder.targetAmount) {
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(withdrawOrder);
        if (transferR.success) {
          const signature: string = await lunar.signTypedData(transferR.data);
          // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
          const acceptedWithdrawOrder = (await workerCtx.requestHandler({
            name: APIName.CREATE_WITHDRAW_TRADE,
            method: Method.POST,
            body: {
              applyData: withdrawOrder,
              userSignature: signature,
              balance: getBalance(withdrawOrder.targetAsset),
            },
          })) as IAcceptedWithdrawOrder;
          updateBalance(acceptedWithdrawOrder.balanceDifferenceCauseByOrder);
          const history: IOrder = acceptedOrderToOrder(acceptedWithdrawOrder);
          setHistories(prev => [...prev, history]);
          result = {
            success: true,
            code: Code.SUCCESS,
            data: history,
          };
        }
      }
      return result;
    } else {
      await connect();
      return withdraw(withdrawOrder);
    }
  };

  const listHistories = async () => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      const histories = (await workerCtx.requestHandler({
        name: APIName.LIST_HISTORIES,
        method: Method.GET,
      })) as IOrder[];
      setHistories(histories);
      result = defaultResultSuccess;
      result.data = histories;
    }
    return result;
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
  /* Deprecated: 由 issue#419 處理，留著做為參考 (20230423 - tzuhan)
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.ORDER, updateHistories), []);
  */
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
