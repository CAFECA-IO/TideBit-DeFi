import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext, useEffect} from 'react';
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
import {IBalance, isIBalance} from '../interfaces/tidebit_defi_background/balance';
import {INotificationItem} from '../interfaces/tidebit_defi_background/notification_item';
import {TideBitEvent} from '../constants/tidebit_event';
import {NotificationContext} from './notification_context';
import {ITickerData} from '../interfaces/tidebit_defi_background/ticker_data';
import {OrderState} from '../constants/order_state';
import {WorkerContext} from './worker_context';
import {IApplyCreateCFDOrder} from '../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {IApplyCloseCFDOrder} from '../interfaces/tidebit_defi_background/apply_close_cfd_order';
import {IApplyUpdateCFDOrder} from '../interfaces/tidebit_defi_background/apply_update_cfd_order';
import TransactionEngineInstance from '../lib/engines/transaction_engine';
import {IAcceptedCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {IApplyDepositOrder} from '../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../interfaces/tidebit_defi_background/apply_withdraw_order';
import {IAcceptedWithdrawOrder} from '../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {IAcceptedDepositOrder} from '../interfaces/tidebit_defi_background/accepted_deposit_order';
import {APIName, Method, TypeRequest} from '../constants/api_request';
// import SafeMath from '../lib/safe_math';
import {Code, ICode, Reason} from '../constants/code';
import {
  getCookieByName,
  getServiceTermContract,
  getTimestamp,
  randomHex,
  rlpEncodeServiceTerm,
  verifySignedServiceTerm,
  wait,
} from '../lib/common';
import {IAcceptedOrder} from '../interfaces/tidebit_defi_background/accepted_order';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../interfaces/tidebit_defi_background/order';
import {CustomError} from '../lib/custom_error';
//import {setTimeout} from 'timers/promises';
import {IWalletExtension, WalletExtension} from '../constants/wallet_extension';

export interface IMyAssets {
  currency: string;
  balance: {
    available: number;
    locked: number;
  };
  pnl: {
    today: {
      amount: number;
      percentage: number;
    };
    monthly: {
      amount: number;
      percentage: number;
    };
    cumulative: {
      amount: number;
      percentage: number;
    };
  };
  interest: {
    apy: number;
    monthly: number;
    cumulative: number;
  };
}
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
  /**
   * openCFDs: {
   *   [id: string (createId)]: IAcceptedCFDOrder[]
   * }
   */
  openCFDs: ICFDOrder[];
  closedCFDs: ICFDOrder[];
  deposits: IDepositOrder[];
  withdraws: IWithdrawOrder[];
  histories: IAcceptedOrder[];
  connect: () => Promise<IResult>;
  signServiceTerm: () => Promise<IResult>;
  disconnect: () => Promise<IResult>;
  addFavorites: (props: string) => Promise<IResult>;
  removeFavorites: (props: string) => Promise<IResult>;
  listHistories: (props: string) => Promise<IResult>;
  listCFDs: (props: string) => Promise<IResult>;
  getCFD: (props: string) => ICFDOrder | null;
  createCFDOrder: (props: IApplyCreateCFDOrder | undefined) => Promise<IResult>;
  closeCFDOrder: (props: IApplyCloseCFDOrder | undefined) => Promise<IResult>;
  updateCFDOrder: (props: IApplyUpdateCFDOrder | undefined) => Promise<IResult>;
  listDeposits: (props: string) => Promise<IResult>;
  deposit: (props: IApplyDepositOrder) => Promise<IResult>;
  listWithdraws: (props: string) => Promise<IResult>;
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
  getMyAssets: (props: string) => IMyAssets | null;
  init: () => Promise<void>;
  walletExtensions: IWalletExtension[];
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
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  signServiceTerm: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  disconnect: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  addFavorites: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  removeFavorites: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  listHistories: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  listCFDs: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  getCFD: (): ICFDOrder | null => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  createCFDOrder: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  closeCFDOrder: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  updateCFDOrder: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  listDeposits: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  deposit: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  listWithdraws: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  withdraw: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  sendEmailCode: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  connectEmail: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  toggleEmailNotification: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  subscribeNewsletters: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  connectTideBit: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  shareTradeRecord: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  readNotifications: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  getBalance: () => null,
  getWalletBalance: () => null,
  getMyAssets: () => null,
  init: () => Promise.resolve(),
  walletExtensions: [],
});

export const UserProvider = ({children}: IUserProvider) => {
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
  const [histories, setHistories, historiesRef] = useState<IAcceptedOrder[]>([]);
  const [openCFDs, setOpenedCFDs, openCFDsRef] = useState<Array<ICFDOrder>>([]);
  const [closedCFDs, setClosedCFDs, closedCFDsRef] = useState<Array<ICFDOrder>>([]);
  const [deposits, setDeposits, depositsRef] = useState<Array<IDepositOrder>>([]);
  const [withdraws, setWithdraws, withdrawsRef] = useState<Array<IWithdrawOrder>>([]);
  const [isSubscibedNewsletters, setIsSubscibedNewsletters, isSubscibedNewslettersRef] =
    useState<boolean>(false);
  const [isEnabledEmailNotification, setIsEnabledEmailNotification, isEnabledEmailNotificationRef] =
    useState<boolean>(false);
  const [isConnectedWithEmail, setIsConnectedWithEmail, isConnectedWithEmailRef] =
    useState<boolean>(false);
  const [isConnectedWithTideBit, setIsConnectedWithTideBit, isConnectedWithTideBitRef] =
    useState<boolean>(false);
  const [selectedTicker, setSelectedTicker, selectedTickerRef] = useState<ITickerData | null>(null);
  const [walletExtensions, setWalletExtensions, walletExtensionsRef] = useState<IWalletExtension[]>(
    [WalletExtension.META_MASK]
  ); // ToDo: Get user wallet extension (20230419 - Shirley)

  const setPrivateData = async (walletAddress: string) => {
    setEnableServiceTerm(true);
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
    // clear DeWT
    setDeWT('');
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

  const privateRequestHandler = useCallback(async (data: TypeRequest) => {
    try {
      const isDeWTLegit = checkDeWT();
      if (isDeWTLegit) {
        return await workerCtx.requestHandler({
          ...data,
          headers: {
            'DeWT': getCookieByName('DeWT'),
          },
        });
      } else {
        throw new CustomError(Code.DEWT_IS_NOT_LEGIT);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const listFavoriteTickers = useCallback(async (address?: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const tickers = (await privateRequestHandler({
          name: APIName.LIST_FAVORITE_TICKERS,
          method: Method.GET,
          // params: {
          //   address,
          // },
        })) as string[];
        setFavoriteTickers(tickers);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`listFavoriteTickers error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  }, []);

  const listCFDs = useCallback(async (ticker: string) => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        const CFDs = (await privateRequestHandler({
          name: APIName.LIST_CFD_TRADES,
          method: Method.GET,
          params: {
            ticker,
          },
        })) as ICFDOrder[];
        let openCFDs: ICFDOrder[] = [];
        let closedCFDs: ICFDOrder[] = [];
        for (const CFD of CFDs) {
          switch (CFD.state) {
            case OrderState.OPENING:
            case OrderState.FREEZED:
              openCFDs = openCFDs.concat(CFD);
              break;
            case OrderState.CLOSED:
              closedCFDs = closedCFDs.concat(CFD);
              break;
            default:
              break;
          }
        }
        setOpenedCFDs(openCFDs);
        setClosedCFDs(closedCFDs);
        // eslint-disable-next-line no-console
        console.log(`openCFDs`, openCFDsRef.current);
        // eslint-disable-next-line no-console
        console.log(`closedCFDs`, closedCFDsRef.current);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`listCFDs error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
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
        const deposits = (await privateRequestHandler({
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
        })) as IDepositOrder[];
        setDeposits(deposits);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`listDeposits error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  }, []);

  const listWithdraws = useCallback(async (address: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const withdraws = (await privateRequestHandler({
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
        })) as IWithdrawOrder[];
        setWithdraws(withdraws);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`listWithdraws error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  }, []);

  const listBalances = useCallback(async (address?: string) => {
    let result: IResult = defaultResultFailed;
    if (enableServiceTermRef.current) {
      try {
        const balances = (await privateRequestHandler({
          name: APIName.LIST_BALANCES,
          method: Method.GET,
          // params: {
          //   address,
          // },
        })) as IBalance[];
        setBalances(balances);
        result = defaultResultSuccess;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`listBalances error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  }, []);

  const connect = async () => {
    let result: IResult = defaultResultFailed,
      resultCode = Code.UNKNOWN_ERROR;

    try {
      resultCode = Code.WALLET_IS_NOT_CONNECT;
      const connect = await lunar.connect({});
      if (connect && lunar.isConnected) {
        resultCode = Code.DEWT_IS_NOT_LEGIT;
        const isDeWTLegit = checkDeWT();
        if (isDeWTLegit) await setPrivateData(lunar.address);
        resultCode = Code.SUCCESS;
        result = {
          success: true,
          code: resultCode,
        };
      }
    } catch (error) {
      result.code = resultCode;
      result.reason = Reason[result.code];
    }
    return result;
  };

  const checkDeWT = (): boolean => {
    let isDeWTLegit = false;
    // 1. get DeWT from cookie
    const deWT = getCookieByName('DeWT');
    if (!!deWT) {
      const tmp = deWT.split('.');
      const encodedData = tmp[0];
      const signature = tmp[1];
      // 2. decode and verify signed serviceTermContract
      const result = verifySignedServiceTerm(encodedData);
      isDeWTLegit = result.isDeWTLegit;

      // 3. verify signature with recreate serviceTermContract
      const serviceTermContractTemplate = getServiceTermContract(lunar.address);
      const serviceTermContract = {
        ...serviceTermContractTemplate,
        ...result.serviceTerm,
      };
      const verifyR: boolean = lunar.verifyTypedData(serviceTermContract, `0x${signature}`);
      isDeWTLegit = isDeWTLegit && verifyR;

      // eslint-disable-next-line no-console
      console.log(`isDeWTLegit`, isDeWTLegit);
    }
    if (!isDeWTLegit) {
      clearPrivateData();
    }
    return isDeWTLegit;
  };

  const setDeWT = (deWT: string) => {
    document.cookie = `DeWT=${deWT}`;
  };

  const signServiceTerm = async (): Promise<IResult> => {
    let eip712signature: string,
      result: IResult = defaultResultFailed,
      resultCode = Code.UNKNOWN_ERROR;

    try {
      if (lunar.isConnected) {
        const serviceTermContract = getServiceTermContract(lunar.address);
        const encodedData = rlpEncodeServiceTerm(serviceTermContract);
        resultCode = Code.SERVICE_TERM_DISABLE;
        eip712signature = await lunar.signTypedData(serviceTermContract);
        const verifyR: boolean = lunar.verifyTypedData(serviceTermContract, eip712signature);
        // eslint-disable-next-line no-console
        console.log(`verifyR`, verifyR);
        if (verifyR) {
          const deWT = `${encodedData}.${eip712signature.replace('0x', '')}`;
          setDeWT(deWT);
          // ++ TODO to checksum address
          await setPrivateData(lunar.address);
          resultCode = Code.SUCCESS;
          result = {
            success: true,
            code: resultCode,
          };
        }
        return result;
      } else {
        const isConnected = await connect();
        if (isConnected) return signServiceTerm();
        else {
          resultCode = Code.WALLET_IS_NOT_CONNECT;
          result.code = resultCode;
          result.reason = Reason[result.code];
          return result;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`signServiceTerm error`, error);
      result.code = resultCode;
      result.reason = Reason[resultCode];
      return result;
    }
  };

  const disconnect = async () => {
    let result: IResult = defaultResultFailed;
    try {
      clearPrivateData();
      setIsConnected(false);
      await lunar.disconnect();
      if (!lunar.isConnected) {
        /** TODO  */
        result = {
          success: true,
          code: Code.SUCCESS,
        };
      }
    } catch (error) {
      // await disconnect();
    }
    return result;
  };

  const addFavorites = async (newFavorite: string) => {
    let result: IResult = defaultResultFailed;
    if (isConnectedRef.current) {
      try {
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
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`${APIName.ADD_FAVORITE_TICKERS} error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  };

  const removeFavorites = async (ticker: string) => {
    let result: IResult = defaultResultFailed;
    if (isConnectedRef.current) {
      try {
        const updatedFavoriteTickers = [...favoriteTickers];
        const index: number = updatedFavoriteTickers.findIndex(currency => currency === ticker);
        if (index !== -1) {
          (await privateRequestHandler({
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
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`${APIName.REMOVE_FAVORITE_TICKERS} error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
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

  const getMyAssets = (currency: string) => {
    const myAsset: IMyAssets = {
      currency: 'USDT',
      balance: {
        available: 1296.47,
        locked: 589.628,
      },
      pnl: {
        today: {
          amount: -128.293,
          percentage: -1.5,
        },
        monthly: {amount: 98164532.83, percentage: 10.36},
        cumulative: {amount: -57692.4, percentage: -22.75},
      },
      interest: {
        apy: 1,
        monthly: 20.2,
        cumulative: 245,
      },
    };
    return myAsset;
  };
  /** Deprecated: transaction return updated balance (20230412 - tzuhan) 
  const updateBalance = (balanceDiff: IBalance) => {
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
      } else throw new CustomError(Code.BALANCE_NOT_FOUND);
    } else throw new CustomError(Code.BALANCE_NOT_FOUND);
  };
  */

  const updateBalance = (updatedBalance: IBalance) => {
    // ToDo: throw error `Invalid input in updateBalance` (20230424 - Shirley)
    // Deprecated: not found currency (20230430 - Shirley)
    // eslint-disable-next-line no-console
    console.log('arg in updateBalance in ctx', updatedBalance);
    if (!isIBalance(updatedBalance)) throw new CustomError(Code.BALANCE_NOT_FOUND);
    // balancesRef.current
    try {
      if (balancesRef.current) {
        const index = balancesRef.current?.findIndex(balance => balance.currency);
        if (index !== -1) {
          const updateBalances = [...balancesRef.current];
          updateBalances[index] = updatedBalance;
          setBalances(updateBalances);
        } else throw new CustomError(Code.BALANCE_NOT_FOUND);
      } else throw new CustomError(Code.BALANCE_NOT_FOUND);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error in updateBalance in ctx', error);
    }
  };

  const _createCFDOrder = async (
    applyCreateCFDOrder: IApplyCreateCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    let resultCode = Code.UNKNOWN_ERROR;
    if (lunar.isConnected) {
      if (applyCreateCFDOrder) {
        const balance: IBalance | null = getBalance(applyCreateCFDOrder.margin.asset);

        if (balance && balance.available >= applyCreateCFDOrder.margin.amount) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCreateCFDOrder);
          if (transferR.success) {
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            try {
              resultCode = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);
              const now = getTimestamp();

              // ToDo: Check if the quotation is expired, if so return `failed result` in `catch`. (20230414 - Shirley)
              if (applyCreateCFDOrder.quotation.deadline < now) {
                resultCode = Code.EXPIRED_QUOTATION_FAILED;
                result.code = resultCode;
                result.reason = Reason[resultCode];
                const error = new CustomError(resultCode);
                throw error;
              }

              resultCode = Code.INTERNAL_SERVER_ERROR;
              const {CFDOrder, acceptedCFDOrder} = (await privateRequestHandler({
                name: APIName.CREATE_CFD_TRADE,
                method: Method.POST,
                body: {applyData: applyCreateCFDOrder, balance: balance, userSignature: signature},
              })) as {CFDOrder: ICFDOrder; acceptedCFDOrder: IAcceptedCFDOrder};
              // TODO: extract ICFDOrder from IAcceptedCFDOrder (20230412 - tzuhan)
              setOpenedCFDs(prev => [...prev, CFDOrder]);
              // Deprecated: not found currency (20230430 - Shirley)
              // eslint-disable-next-line no-console
              console.log('acceptedCFDOrder in _createCFDOrder in ctx', acceptedCFDOrder);
              // ToDo: resultCode (20230424 - Shirley)
              updateBalance(acceptedCFDOrder.receipt.balance);
              setHistories(prev => [...prev, acceptedCFDOrder]);

              resultCode = Code.SUCCESS;
              result = {
                success: true,
                code: resultCode,
                data: {order: CFDOrder, acceptedOrder: acceptedCFDOrder},
              };
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.CREATE_CFD_TRADE} error`, error);
              result.code = resultCode;
              result.reason = Reason[resultCode];
            }
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return createCFDOrder(applyCreateCFDOrder);
      else {
        resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }
  };

  const createCFDOrder = async (
    applyCreateCFDOrder: IApplyCreateCFDOrder | undefined
  ): Promise<IResult> => {
    const timeLeft = (Number(applyCreateCFDOrder?.quotation.deadline) - getTimestamp()) * 1000;

    if (timeLeft < 0) {
      const result: IResult = {...defaultResultFailed};
      const resultCode = Code.EXPIRED_QUOTATION_CANCELED;
      result.code = resultCode;
      result.reason = Reason[resultCode];
      return result;
    }

    const countdown = () =>
      new Promise<IResult>(resolve => {
        window.setTimeout(() => {
          const result: IResult = {...defaultResultFailed};
          const resultCode = Code.EXPIRED_QUOTATION_CANCELED;
          result.code = resultCode;
          result.reason = Reason[resultCode];
          resolve(result);
        }, timeLeft);
      });

    if (!lunar.isConnected) {
      const isConnected = await connect();
      if (!isConnected) {
        const result: IResult = {...defaultResultFailed};
        const resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }

    return Promise.race([_createCFDOrder(applyCreateCFDOrder), countdown()]);
  };

  const _closeCFDOrder = async (
    applyCloseCFDOrder: IApplyCloseCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    let resultCode = Code.UNKNOWN_ERROR;

    if (lunar.isConnected) {
      if (applyCloseCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyCloseCFDOrder.referenceId);
        if (index !== -1) {
          const balance: IBalance | null = getBalance(openCFDs[index].targetAsset);
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCloseCFDOrder);
          if (transferR.success) {
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            try {
              resultCode = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);
              const now = getTimestamp();

              // ToDo: Check if the quotation is expired, if so return `failed result` in `catch`. (20230414 - Shirley)
              if (applyCloseCFDOrder.quotation.deadline < now) {
                resultCode = Code.EXPIRED_QUOTATION_FAILED;
                result.code = resultCode;
                result.reason = Reason[resultCode];
                const error = new CustomError(resultCode);
                throw error;
              }

              resultCode = Code.INTERNAL_SERVER_ERROR;
              const {updateCFDOrder, acceptedCFDOrder} = (await privateRequestHandler({
                name: APIName.CLOSE_CFD_TRADE,
                method: Method.PUT,
                body: {
                  applyData: applyCloseCFDOrder,
                  openCFD: openCFDs[index], // Deprecated: remove when backend is ready (20230424 - tzuhan)
                  balance,
                  userSignature: signature,
                },
              })) as {updateCFDOrder: ICFDOrder; acceptedCFDOrder: IAcceptedCFDOrder};
              const newOpenedCFDs = [...openCFDs];
              newOpenedCFDs.splice(index, 1);
              setOpenedCFDs(newOpenedCFDs);
              setClosedCFDs(prev => [...prev, updateCFDOrder]);
              // ToDo: resultCode (20230424 - Shirley)
              updateBalance(acceptedCFDOrder.receipt.balance);
              setHistories(prev => [...prev, acceptedCFDOrder]);

              resultCode = Code.SUCCESS;
              result = {
                success: true,
                code: resultCode,
                data: {order: updateCFDOrder, acceptedOrder: acceptedCFDOrder},
              };
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.CLOSE_CFD_TRADE} error`, error);
              result.code = resultCode;
              result.reason = Reason[resultCode];
            }
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return closeCFDOrder(applyCloseCFDOrder);
      else {
        resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }
  };

  const closeCFDOrder = async (
    applyCloseCFDOrder: IApplyCloseCFDOrder | undefined
  ): Promise<IResult> => {
    const timeLeft = (Number(applyCloseCFDOrder?.quotation.deadline) - getTimestamp()) * 1000;
    if (timeLeft < 0) {
      const result: IResult = {...defaultResultFailed};
      const resultCode = Code.EXPIRED_QUOTATION_CANCELED;
      result.code = resultCode;
      result.reason = Reason[resultCode];
      return result;
    }

    const countdown = () =>
      new Promise<IResult>(resolve => {
        window.setTimeout(() => {
          const result: IResult = {...defaultResultFailed};
          const resultCode = Code.EXPIRED_QUOTATION_CANCELED;
          result.code = resultCode;
          result.reason = Reason[resultCode];
          resolve(result);
        }, timeLeft);
      });

    if (!lunar.isConnected) {
      const isConnected = await connect();
      if (!isConnected) {
        const result: IResult = {...defaultResultFailed};
        const resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }

    return Promise.race([_closeCFDOrder(applyCloseCFDOrder), countdown()]);
  };

  const updateCFDOrder = async (
    applyUpdateCFDOrder: IApplyUpdateCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    let resultCode = Code.UNKNOWN_ERROR;

    if (lunar.isConnected) {
      if (applyUpdateCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyUpdateCFDOrder.referenceId);
        if (index !== -1) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyUpdateCFDOrder);
          // Deprecated: not found currency (20230430 - Shirley)
          // eslint-disable-next-line no-console
          console.log('original CFD in ctx', openCFDs[index]);
          if (transferR.success) {
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            try {
              resultCode = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);

              resultCode = Code.INTERNAL_SERVER_ERROR;
              const {updateCFDOrder, acceptedCFDOrder} = (await privateRequestHandler({
                name: APIName.UPDATE_CFD_TRADE,
                method: Method.PUT,
                body: {
                  applyData: applyUpdateCFDOrder,
                  userSignature: signature,
                  openCFD: openCFDs[index], // Deprecated: remove when backend is ready (20230424 - tzuhan)
                },
              })) as {updateCFDOrder: ICFDOrder; acceptedCFDOrder: IAcceptedCFDOrder};
              const updateCFDOrders = [...openCFDs];
              updateCFDOrders[index] = updateCFDOrder;
              // Deprecated: not found currency (20230430 - Shirley)
              // eslint-disable-next-line no-console
              console.log('THE updated CFD in ctx', updateCFDOrders[index]);
              setOpenedCFDs(updateCFDOrders);
              // Deprecated: not found currency (20230430 - Shirley)
              // eslint-disable-next-line no-console
              console.log('after updating CFD in ctx', openCFDsRef.current);
              // Deprecated: not found currency (20230430 - Shirley)
              // eslint-disable-next-line no-console
              console.log('acceptedCFD in ctx', acceptedCFDOrder);
              updateBalance(acceptedCFDOrder.receipt.balance);
              setHistories(prev => [...prev, acceptedCFDOrder]);

              resultCode = Code.SUCCESS;
              result = {
                success: true,
                code: resultCode,
                data: {order: updateCFDOrder, acceptedOrder: acceptedCFDOrder},
              };
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.UPDATE_CFD_TRADE} error`, error);
              result.code = resultCode;
              result.reason = Reason[resultCode];
            }
          }
        }
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return updateCFDOrder(applyUpdateCFDOrder);
      else {
        resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }
  };

  const deposit = async (depositOrder: IApplyDepositOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    let resultCode = Code.UNKNOWN_ERROR;

    if (lunar.isConnected) {
      try {
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

        resultCode = Code.INTERNAL_SERVER_ERROR;
        const acceptedDepositOrder = (await privateRequestHandler({
          name: APIName.CREATE_DEPOSIT_TRADE,
          method: Method.POST,
          body: {applyData: depositOrder, txid, balance: getBalance(depositOrder.targetAsset)},
        })) as IAcceptedDepositOrder;
        setDeposits(prev => [...prev, acceptedDepositOrder.receipt.order]);
        updateBalance(acceptedDepositOrder.receipt.balance);
        setHistories(prev => [...prev, acceptedDepositOrder]);

        resultCode = Code.SUCCESS;
        result = {
          success: true,
          code: resultCode,
          data: acceptedDepositOrder,
        };
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`${APIName.CREATE_DEPOSIT_TRADE} error`, error);
        result.code = resultCode;
        result.reason = Reason[resultCode];
      }
      return result;
    } else {
      const isConnected = await connect();
      if (isConnected) return deposit(depositOrder);
      else {
        resultCode = Code.WALLET_IS_NOT_CONNECT;
        result.code = resultCode;
        result.reason = Reason[result.code];
        return result;
      }
    }
  };

  const withdraw = async (withdrawOrder: IApplyWithdrawOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    let resultCode = Code.UNKNOWN_ERROR;

    if (lunar.isConnected) {
      const balance: IBalance | null = getBalance(withdrawOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= withdrawOrder.targetAmount) {
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(withdrawOrder);
        if (transferR.success) {
          // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
          try {
            resultCode = Code.REJECTED_SIGNATURE;
            const signature: string = await lunar.signTypedData(transferR.data);

            resultCode = Code.INTERNAL_SERVER_ERROR;
            const acceptedWithdrawOrder = (await privateRequestHandler({
              name: APIName.CREATE_WITHDRAW_TRADE,
              method: Method.POST,
              body: {
                applyData: withdrawOrder,
                userSignature: signature,
                balance: getBalance(withdrawOrder.targetAsset),
              },
            })) as IAcceptedWithdrawOrder;
            setWithdraws(prev => [...prev, acceptedWithdrawOrder.receipt.order]);
            updateBalance(acceptedWithdrawOrder.receipt.balance);
            setHistories(prev => [...prev, acceptedWithdrawOrder]);

            resultCode = Code.SUCCESS;
            result = {
              success: true,
              code: resultCode,
              data: acceptedWithdrawOrder,
            };
          } catch (error) {
            // TODO: error handle (Tzuhan - 20230421)
            // eslint-disable-next-line no-console
            console.error(`${APIName.CREATE_WITHDRAW_TRADE} error`, error);
            result.code = resultCode;
            result.reason = Reason[resultCode];
          }
        }
      }
      return result;
    } else {
      await connect();
      return withdraw(withdrawOrder);
    }
  };

  // TODO: update histories api and dummy data(20230331 - tzuhan)
  const listHistories = async () => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        const histories = (await privateRequestHandler({
          name: APIName.LIST_HISTORIES,
          method: Method.GET,
        })) as IAcceptedOrder[];
        setHistories(histories);
        result = defaultResultSuccess;
        result.data = histories;
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`${APIName.LIST_HISTORIES} error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
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
        listCFDs(ticker?.currency);
      }),
    []
  );

  const init = async () => {
    const isDeWTLegit = checkDeWT();
    /** TODO: wait for lunar isConnected & lunar.address (20230421 - tzuhan)
    if (isDeWTLegit && lunar.isConnected) await setPrivateData(lunar.address);
    // eslint-disable-next-line no-console
    console.log(`lunar.isConnected: ${lunar.isConnected}`);
    // eslint-disable-next-line no-console
     console.log(`lunar.address: ${lunar.address}`);
    */
    if (isDeWTLegit) await setPrivateData(lunar.address);
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
    getMyAssets,
    init,
    walletExtensions: walletExtensionsRef.current,
  };

  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
