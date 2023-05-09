import Lunar from '@cafeca/lunar';
import React, {createContext, useCallback, useContext} from 'react';
import useState from 'react-usestateref';
import {
  IResult,
  defaultResultFailed,
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
import {IApplyDepositOrder} from '../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../interfaces/tidebit_defi_background/apply_withdraw_order';
import {APIName, Method, TypeRequest} from '../constants/api_request';
// import SafeMath from '../lib/safe_math';
import {Code, Reason} from '../constants/code';
import {
  getCookieByName,
  getServiceTermContract,
  getTimestamp,
  randomHex,
  rlpEncodeServiceTerm,
  verifySignedServiceTerm,
} from '../lib/common';
import {IAcceptedOrder} from '../interfaces/tidebit_defi_background/accepted_order';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../interfaces/tidebit_defi_background/order';
import {CustomError, isCustomError} from '../lib/custom_error';
//import {setTimeout} from 'timers/promises';
import {IWalletExtension, WalletExtension} from '../constants/wallet_extension';
import {Events} from '../constants/events';
import {IUser} from '../interfaces/tidebit_defi_background/user';
import TickerBookInstance from '../lib/books/ticker_book';
import {IUserBalance} from '../interfaces/tidebit_defi_background/user_balance';
import {ProfitState} from '../constants/profit_state';

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

  const setPrivateData = async (address: string, deWT: string) => {
    let result: IResult = {
      success: false,
      code: Code.INTERNAL_SERVER_ERROR,
      reason: Reason[Code.INTERNAL_SERVER_ERROR],
    };
    result = await deWTLogin(address, deWT);
    if (result.success) {
      setEnableServiceTerm(true);
      setWallet(address);
      setWalletBalances([dummyWalletBalance_BTC, dummyWalletBalance_ETH, dummyWalletBalance_USDT]);
      // TODO: User balance from backend (20230324 - tzuhan)
      await listBalances();
      if (selectedTickerRef.current) {
        await listCFDs(selectedTickerRef.current.currency);
      }
      await listFavoriteTickers();
      await listHistories();

      workerCtx.subscribeUser(address);
    } else {
      clearPrivateData();
    }
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
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        const tickers = (await privateRequestHandler({
          name: APIName.LIST_FAVORITE_TICKERS,
          method: Method.GET,
          // query: {
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
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.LIST_CFD_TRADES,
          method: Method.GET,
          query: {
            ticker,
          },
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`listHistories result`, result);
        if (result.success) {
          const CFDs = result.data as ICFDOrder[];
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
        }
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
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        const deposits = (await privateRequestHandler({
          name: APIName.LIST_DEPOSIT_TRADES,
          method: Method.GET,
          query: {
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
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        const withdraws = (await privateRequestHandler({
          name: APIName.LIST_DEPOSIT_TRADES,
          method: Method.GET,
          query: {
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

  const sumBalance = () => {
    let sumAvailable = 0,
      sumLocked = 0;
    if (balancesRef.current) {
      for (const balance of balancesRef.current) {
        const rate = tickerBook.getCurrencyRate(balance.currency);
        sumAvailable += balance.available * rate;
        sumLocked += balance.locked * rate;
      }
      setBalance({
        available: sumAvailable,
        locked: sumLocked,
        total: sumAvailable + sumLocked,
        PNL: {
          type: ProfitState.EQUAL,
          value: 0,
        }, // TODO: Caculate PNL (20230508 - tzuhan)
      });
    }
  };

  const getTotalBalance = useCallback(async () => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.GET_TOTAL_BALANCE,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`getTotalBalance result`, result);
        if (result.success) {
          const balance = result.data as IUserBalance;
          setBalance(balance);
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`getTotalBalance error`, error);
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
      }
    }
    return result;
  }, []);

  const listBalances = useCallback(async () => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.LIST_BALANCES,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`listBalances result`, result);
        if (result.success) {
          const balances = result.data as IBalance[];
          setBalances(balances);
          sumBalance();
        }
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
    let result: IResult = {...defaultResultFailed},
      resultCode = Code.UNKNOWN_ERROR;

    try {
      resultCode = Code.WALLET_IS_NOT_CONNECT;
      const connect = await lunar.connect({});
      if (connect && lunar.isConnected) {
        resultCode = Code.DEWT_IS_NOT_LEGIT;
        const {isDeWTLegit, signer, deWT} = checkDeWT();
        if (isDeWTLegit && signer && deWT) await setPrivateData(signer, deWT);
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

  const checkDeWT = (): {
    isDeWTLegit: boolean;
    signer: string | undefined;
    deWT: string | undefined;
  } => {
    let isDeWTLegit = false,
      signer: string | undefined;
    // 1. get DeWT from cookie
    const deWT = getCookieByName('DeWT');
    if (!!deWT) {
      const tmp = deWT.split('.');
      const encodedData = tmp[0];
      const signature = tmp[1];
      // 2. decode and verify signed serviceTermContract
      const result = verifySignedServiceTerm(encodedData);
      isDeWTLegit = result.isDeWTLegit;
      if (isDeWTLegit) {
        signer = result.serviceTerm?.message?.signer;
        // 3. verify signature with recreate serviceTermContract
        const serviceTermContractTemplate = getServiceTermContract(lunar.address);
        const serviceTermContract = {
          ...serviceTermContractTemplate,
          ...result.serviceTerm,
        };
        const verifyR: boolean = lunar.verifyTypedData(serviceTermContract, `0x${signature}`);
        isDeWTLegit = isDeWTLegit && !!signer && verifyR;
      }
    }
    if (!isDeWTLegit) {
      clearPrivateData();
    }
    return {isDeWTLegit, signer, deWT};
  };

  const deWTLogin = async (address: string, deWT: string) => {
    let result: IResult = {...defaultResultSuccess};
    if (address && deWT) {
      // Info postDeWT and get User data
      try {
        result = (await privateRequestHandler({
          name: APIName.POST_DEWT,
          method: Method.POST,
          body: {
            address,
            deWT,
          },
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`deWTLogin result`, result);
        if (result.success) {
          const {user, expiredAt} = result.data as {user: IUser; expiredAt: string};
          const expiredAtDate = new Date(expiredAt);
          // Deprecate: after this functions finishing (20230508 - tzuhan)
          // eslint-disable-next-line no-console
          console.log(`deWTLogin user`, user);
          // Deprecate: after this functions finishing (20230508 - tzuhan)
          // eslint-disable-next-line no-console
          console.log(`deWTLogin expiredAtDate`, expiredAtDate);
          // TODO: setTimeOut to clearPrivateData() (20230508 - tzuhan)
          setId(user.id);
          setUsername(user?.name || user.address);
        } else {
          clearPrivateData();
        }
      } catch (error) {
        result.code = Code.INTERNAL_SERVER_ERROR;
        result.reason = Reason[result.code];
        // Deprecate: after implementing error handle (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.error(`deWTLogin error`, error);
      }
    }
    return result;
  };

  const setDeWT = async (deWT: string) => {
    document.cookie = `DeWT=${deWT}`;
  };

  const signServiceTerm = async (): Promise<IResult> => {
    let eip712signature: string,
      result: IResult = {...defaultResultFailed},
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
          await setPrivateData(lunar.address, deWT);
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
    let result: IResult = {...defaultResultFailed};
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
    let result: IResult = {...defaultResultFailed};
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
    let result: IResult = {...defaultResultFailed};
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

  const getBalance = (currency: string) => {
    let balance: IBalance | null = null;
    if (balancesRef.current) {
      const index: number = balancesRef.current.findIndex(wb => wb.currency === currency);
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

  const updateBalance = (updatedBalances: IBalance[]) => {
    for (const updatedBalance of updatedBalances) {
      if (!isIBalance(updatedBalance)) throw new CustomError(Code.BALANCE_NOT_FOUND);
      try {
        if (balancesRef.current) {
          const index = balancesRef.current?.findIndex(
            balance => balance.currency === updatedBalance.currency
          );
          if (index !== -1) {
            const updateBalances = [...balancesRef.current];
            updateBalances[index] = updatedBalance;
            setBalances(updateBalances);
            sumBalance();
          } else throw new CustomError(Code.BALANCE_NOT_FOUND);
        } else throw new CustomError(Code.BALANCE_NOT_FOUND);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('error in updateBalance in ctx', error);
        throw new CustomError(Code.FAILE_TO_UPDATE_BALANCE);
      }
    }
  };

  const _createCFDOrder = async (
    applyCreateCFDOrder: IApplyCreateCFDOrder | undefined
  ): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    // Deprecated: [debug] (20230509 - Tzuhan)
    // eslint-disable-next-line no-console
    console.log('_createCFDOrder enableServiceTermRef.current', enableServiceTermRef.current);
    if (enableServiceTermRef.current) {
      if (applyCreateCFDOrder) {
        const balance: IBalance | null = getBalance(applyCreateCFDOrder.margin.asset);
        if (balance && balance.available >= applyCreateCFDOrder.margin.amount) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCreateCFDOrder);
          if (transferR.success) {
            try {
              result.code = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);
              /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
              const success = await lunar.verifyTypedData(transferR.data, signature);
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('_createCFDOrder lunar.verifyTypedData success', success);
              if (!success) throw new Error('verify signature failed');
              const now = getTimestamp();
              // ToDo: Check if the quotation is expired, if so return `failed result` in `catch`. (20230414 - Shirley)
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log(
                `_createCFDOrder applyCreateCFDOrder.quotation.deadline(${
                  applyCreateCFDOrder.quotation.deadline
                }) ${new Date(applyCreateCFDOrder.quotation.deadline * 1000)} < now${now}`,
                applyCreateCFDOrder.quotation.deadline < now
              );
              if (applyCreateCFDOrder.quotation.deadline < now) {
                result.code = Code.EXPIRED_QUOTATION_FAILED;
                result.code = result.code;
                result.reason = Reason[result.code];
                const error = new CustomError(result.code);
                throw error;
              }
              result.code = Code.INTERNAL_SERVER_ERROR;
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('_createCFDOrder request is called');
              result = (await privateRequestHandler({
                name: APIName.CREATE_CFD_TRADE,
                method: Method.POST,
                body: {applyData: applyCreateCFDOrder, userSignature: signature},
              })) as IResult;
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('_createCFDOrder result', result);
              if (result.success) {
                const {balanceSnapshot, orderSnapshot: CFDOrder} = result.data as {
                  txhash: string;
                  orderSnapshot: ICFDOrder;
                  balanceSnapshot: IBalance[];
                };
                setOpenedCFDs(prev => [...prev, CFDOrder]);
                result.code = Code.FAILE_TO_UPDATE_BALANCE;
                updateBalance(balanceSnapshot);
                // setHistories(prev => [...prev, acceptedCFDOrder]);
                result.code = Code.SUCCESS;
                result = {
                  success: true,
                  code: result.code,
                  data: {order: CFDOrder},
                };
              }
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.CREATE_CFD_TRADE} error`, error);
              // Info: `updateBalance` has two options of error (20230426 - Shirley)
              if (isCustomError(error)) {
                if (error.code === Code.BALANCE_NOT_FOUND) {
                  result.code = Code.BALANCE_NOT_FOUND;
                }
              }
              result = {
                success: false,
                code: result.code || Code.INTERNAL_SERVER_ERROR,
                reason:
                  (error as Error)?.message || Reason[result.code || Code.INTERNAL_SERVER_ERROR],
              };
            }
          }
        }
      }
    }
    return result;
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
    // Deprecate: [debug] (20230509 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(`createCFDOrder lunar.isConnected`, lunar.isConnected);

    if (!lunar.isConnected) {
      const isConnected = await connect();
      // Deprecate: [debug] (20230509 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`createCFDOrder isConnected`, isConnected);

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
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    // Deprecated: [debug] (20230509 - Tzuhan)
    // eslint-disable-next-line no-console
    console.log('closeCFDOrder enableServiceTermRef.current', enableServiceTermRef.current);
    if (enableServiceTermRef.current) {
      if (applyCloseCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyCloseCFDOrder.referenceId);
        if (index !== -1) {
          // const balance: IBalance | null = getBalance(openCFDs[index].targetAsset);
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyCloseCFDOrder);
          if (transferR.success) {
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            try {
              result.code = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);
              /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
              const success = await lunar.verifyTypedData(transferR.data, signature);
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('closeCFDOrder lunar.verifyTypedData success', success);
              if (!success) throw new Error('verify signature failed');
              const now = getTimestamp();
              // ToDo: Check if the quotation is expired, if so return `failed result` in `catch`. (20230414 - Shirley)
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log(
                `closeCFDOrder applyCloseCFDOrder.quotation.deadline(${
                  applyCloseCFDOrder.quotation.deadline
                }) ${new Date(applyCloseCFDOrder.quotation.deadline * 1000)} < now${now}`,
                applyCloseCFDOrder.quotation.deadline < now
              );
              if (applyCloseCFDOrder.quotation.deadline < now) {
                result.code = Code.EXPIRED_QUOTATION_FAILED;
                result.code = result.code;
                result.reason = Reason[result.code];
                const error = new CustomError(result.code);
                throw error;
              }
              result.code = Code.INTERNAL_SERVER_ERROR;
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('closeCFDOrder request is called');
              result = (await privateRequestHandler({
                name: APIName.CLOSE_CFD_TRADE,
                method: Method.PUT,
                body: {
                  applyData: applyCloseCFDOrder,
                  userSignature: signature,
                },
              })) as IResult;
              // Deprecated: [debug] (20230509 - Tzuhan)
              // eslint-disable-next-line no-console
              console.log('closeCFDOrder result', result);
              if (result.success) {
                const {balanceSnapshot, orderSnapshot: updateCFDOrder} = result.data as {
                  txhash: string;
                  orderSnapshot: ICFDOrder;
                  balanceSnapshot: IBalance[];
                };
                const newOpenedCFDs = [...openCFDs];
                newOpenedCFDs.splice(index, 1);
                setOpenedCFDs(newOpenedCFDs);
                setClosedCFDs(prev => [...prev, updateCFDOrder]);
                result.code = Code.FAILE_TO_UPDATE_BALANCE;
                updateBalance(balanceSnapshot);
                // setHistories(prev => [...prev, acceptedCFDOrder]);

                result.code = Code.SUCCESS;
                result = {
                  success: true,
                  code: result.code,
                  data: {order: updateCFDOrder},
                };
              }
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.CLOSE_CFD_TRADE} error`, error);
              // Info: `updateBalance` has two options of error (20230426 - Shirley)
              if (isCustomError(error)) {
                if (error.code === Code.BALANCE_NOT_FOUND) {
                  result.code = Code.BALANCE_NOT_FOUND;
                }
              }
              result = {
                success: false,
                code: result.code || Code.INTERNAL_SERVER_ERROR,
                reason:
                  (error as Error)?.message || Reason[result.code || Code.INTERNAL_SERVER_ERROR],
              };
            }
          }
        }
      }
    }
    return result;
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
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      if (applyUpdateCFDOrder) {
        const index = openCFDs.findIndex(o => o.id === applyUpdateCFDOrder.referenceId);
        if (index !== -1) {
          const transferR = transactionEngine.transferCFDOrderToTransaction(applyUpdateCFDOrder);
          if (transferR.success) {
            // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
            try {
              result.code = Code.REJECTED_SIGNATURE;
              const signature: string = await lunar.signTypedData(transferR.data);
              /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
              const success = await lunar.verifyTypedData(transferR.data, signature);
              if (!success) throw new Error('verify signature failed');

              result.code = Code.INTERNAL_SERVER_ERROR;
              result = (await privateRequestHandler({
                name: APIName.UPDATE_CFD_TRADE,
                method: Method.PUT,
                body: {
                  applyData: applyUpdateCFDOrder,
                  userSignature: signature,
                  openCFD: openCFDs[index], // Deprecated: remove when backend is ready (20230424 - tzuhan)
                },
              })) as IResult;
              if (result.success) {
                const {orderSnapshot: updateCFDOrder} = result.data as {
                  txhash: string;
                  orderSnapshot: ICFDOrder;
                  balanceSnapshot: IBalance[];
                };
                const updateCFDOrders = [...openCFDs];
                updateCFDOrders[index] = updateCFDOrder;
                setOpenedCFDs(updateCFDOrders);
                // setHistories(prev => [...prev, acceptedCFDOrder]);

                result.code = Code.SUCCESS;
                result = {
                  success: true,
                  code: result.code,
                  data: {order: updateCFDOrder},
                };
              }
            } catch (error) {
              // TODO: error handle (Tzuhan - 20230421)
              // eslint-disable-next-line no-console
              console.error(`${APIName.UPDATE_CFD_TRADE} error`, error);
              result = {
                success: false,
                code: Code.INTERNAL_SERVER_ERROR,
                reason: (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
              };
            }
          }
        }
      }
    }
    return result;
  };

  const deposit = async (applyDepositOrder: IApplyDepositOrder): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        /** 
      * TODO: temporary comment send metamask, will uncomment (20230329 - tzuhan)
      const walletBalance: IWalletBalance | null = getWalletBalance(depositOrder.targetAsset);
      if (walletBalance && walletBalance.balance >= depositOrder.targetAmount) {
      const transaction: {to: string; amount: number; data: string} =
        transactionEngine.transferDepositOrderToTransaction(depositOrder);
      const txhash = await lunar.send(transaction);
      // TODO: updateWalletBalances
      // */
        const txhash = randomHex(32);
        result = (await privateRequestHandler({
          name: APIName.CREATE_DEPOSIT_TRADE,
          method: Method.POST,
          body: {
            ...applyDepositOrder,
            txhash,
          },
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`deposit result`, result);
        if (result.success) {
          const {orderSnapshot: depositOrder, balanceSnapshot} = result.data as {
            txhash: string;
            orderSnapshot: IDepositOrder;
            balanceSnapshot: IBalance[];
          };
          setDeposits(prev => [...prev, depositOrder]);
          // TODO： remove updateBalance 應該等 Pusher 通知 (20230509 - Tzuhan)
          // updateBalance(balanceSnapshot);
          // setHistories(prev => [...prev, acceptedDepositOrder]);}
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`${APIName.CREATE_DEPOSIT_TRADE} error`, error);
        result = {
          success: false,
          code: Code.INTERNAL_SERVER_ERROR,
          reason: (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
        };
      }
    }
    return result;
  };

  const withdraw = async (applyWithdrawOrder: IApplyWithdrawOrder): Promise<IResult> => {
    let result: IResult = defaultResultFailed;
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      const balance: IBalance | null = getBalance(applyWithdrawOrder.targetAsset); // TODO: ticker is not currency
      if (balance && balance.available >= applyWithdrawOrder.targetAmount) {
        const transferR = transactionEngine.transferWithdrawOrderToTransaction(applyWithdrawOrder);
        if (transferR.success) {
          // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
          try {
            result.code = Code.REJECTED_SIGNATURE;
            const signature: string = await lunar.signTypedData(transferR.data);
            /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
            const success = await lunar.verifyTypedData(transferR.data, signature);
            if (!success) throw new Error('verify signature failed');

            result.code = Code.INTERNAL_SERVER_ERROR;
            result = (await privateRequestHandler({
              name: APIName.CREATE_WITHDRAW_TRADE,
              method: Method.POST,
              body: {
                applyData: applyWithdrawOrder,
                userSignature: signature,
                balance: getBalance(applyWithdrawOrder.targetAsset),
              },
            })) as IResult;
            // Deprecate: after this functions finishing (20230508 - tzuhan)
            // eslint-disable-next-line no-console
            console.log(`withdraw result`, result);
            if (result.success) {
              const {orderSnapshot: withdrawOrder, balanceSnapshot} = result.data as {
                txhash: string;
                orderSnapshot: IWithdrawOrder;
                balanceSnapshot: IBalance[];
              };
              setWithdraws(prev => [...prev, withdrawOrder]);
              updateBalance(balanceSnapshot);
              // setHistories(prev => [...prev, acceptedWithdrawOrder]);

              result.code = Code.SUCCESS;
              result = {
                success: success,
                code: result.code,
                data: {order: withdrawOrder},
              };
            }
          } catch (error) {
            // TODO: error handle (Tzuhan - 20230421)
            // eslint-disable-next-line no-console
            console.error(`${APIName.CREATE_WITHDRAW_TRADE} error`, error);
            result = {
              success: false,
              code: Code.INTERNAL_SERVER_ERROR,
              reason: (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
            };
          }
        }
      }
    }
    return result;
  };

  // TODO: update histories api and dummy data(20230331 - tzuhan)
  const listHistories = async () => {
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.LIST_HISTORIES,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`listHistories result`, result);
        if (result.success) {
          const histories = result.data as IAcceptedOrder[];
          setHistories(histories);
        }
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
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };
  const connectEmail = async (email: string, code: number) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };
  const toggleEmailNotification = async (props: boolean) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };
  const subscribeNewsletters = async (props: boolean) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: put request (Tzuhan - 20230317)
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };
  const connectTideBit = async (email: string, password: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: post request (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };
  const shareTradeRecord = async (tradeId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: call 3rd party api (Tzuhan - 20230317)
      result = defaultResultSuccess;
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };

  const readNotifications = async (notifications: INotificationItem[]) => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        // TODO: post request (Tzuhan - 20230317)
        result = defaultResultSuccess;
        notificationCtx.emitter.emit(TideBitEvent.UPDATE_READ_NOTIFICATIONS_RESULT, notifications);
      } catch (error) {
        result = {...defaultResultFailed};
      }
    }

    return result;
  };

  /* Deprecated: 由 issue#419 處理，留著做為參考 (20230423 - tzuhan)
  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.BALANCE, (balance: IUserBalance) => {
        setBalance(balance);
      }),
    []
  );
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.ORDER, updateHistories), []);
  React.useMemo(() => notificationCtx.emitter.on(TideBitEvent.BALANCES, updateBalances), []);
  */

  const updateBalanceHandler = useCallback((updateBalance: IBalance) => {
    if (balancesRef.current) {
      const updatedBalances = [...balancesRef.current];
      const index = balancesRef.current.findIndex(obj => obj.currency === updateBalance.currency);
      // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
      // eslint-disable-next-line no-console
      // console.log(
      //   `updateBalanceHandler is called updateBalance: index:[${index}]`,
      //   updateBalance,
      //   updatedBalances
      // );
      if (index !== -1) {
        const updatedBalance = {
          ...balancesRef.current[index],
          ...updateBalance,
        };
        updatedBalances[index] = updatedBalance;
      } else updatedBalances.push(updateBalance);
      setBalances(updatedBalances);
      // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
      // eslint-disable-next-line no-console
      // console.log(
      //   `updateBalanceHandler after update`,
      //   index !== -1 ? balancesRef.current[index] : balancesRef.current
      // );
    }
  }, []);

  const updateCFDHandler = useCallback((updateCFD: ICFDOrder) => {
    const _updateCFD = {...updateCFD, ticker: updateCFD.ticker.split('-')[0]};
    let updatedCFDs: ICFDOrder[] = [];
    if (openCFDsRef.current) {
      updatedCFDs = [...updatedCFDs, ...openCFDsRef.current];
    }
    if (closedCFDsRef.current) {
      updatedCFDs = [...updatedCFDs, ...closedCFDsRef.current];
    }
    const index = updatedCFDs.findIndex(obj => obj.id === updateCFD.id);
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(`updateCFDHandler is called updateCFD: index:[${index}]`, _updateCFD, updatedCFDs);
    if (index !== -1) {
      updatedCFDs[index] = _updateCFD;
    } else {
      updatedCFDs.push(_updateCFD);
    }
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(`updateCFDHandler after update`, index !== -1 ? updatedCFDs[index] : updatedCFDs);
    const openCFDs = updatedCFDs.filter(obj => obj.state === OrderState.OPENING);
    const closedCFDs = updatedCFDs.filter(obj => obj.state === OrderState.CLOSED);
    setOpenedCFDs(openCFDs);
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(`updateCFDHandler after update openCFDs`, openCFDsRef.current);
    setClosedCFDs(closedCFDs);
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(`updateCFDHandler after update closedCFDs`, closedCFDsRef.current);
  }, []);

  const updateHistoryHandler = useCallback((history: IAcceptedOrder) => {
    const index = historiesRef.current.findIndex(obj => obj.id === history.id);
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(
    //   `updateHistoryHandler is called history: index[${index}]`,
    //   history,
    //   historiesRef.current
    // );
    if (index === -1) {
      const updatedHistory: IAcceptedOrder[] = [...historiesRef.current];
      updatedHistory.push(history);
      setHistories(updatedHistory);
    }
    // Deprecated: when this function is finished, remove this console (20230504 - tzuhan)
    // eslint-disable-next-line no-console
    // console.log(
    //   `updateHistoryHandler after update historiesRef.current, index:[${index}]`,
    //   historiesRef.current
    // );
  }, []);

  // React.useMemo(() => notificationCtx.emitter.on(Events.BALANCE, updateBalanceHandler), []);
  // React.useMemo(() => notificationCtx.emitter.on(Events.CFD, updateCFDHandler), []);
  React.useMemo(
    () => notificationCtx.emitter.on(Events.BOLT_TRANSACTION, updateHistoryHandler),
    []
  );

  React.useMemo(
    () => notificationCtx.emitter.on(TideBitEvent.UPDATE_READ_NOTIFICATIONS, readNotifications),
    []
  );
  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, (ticker: ITickerData) => {
        if (!selectedTickerRef.current || ticker.instId !== selectedTickerRef.current?.instId) {
          setSelectedTicker(ticker);
          listCFDs(ticker?.currency);
        }
      }),
    []
  );

  const init = async () => {
    const {isDeWTLegit, signer, deWT} = checkDeWT();
    /** TODO: wait for lunar isConnected & lunar.address (20230421 - tzuhan)
    if (isDeWTLegit && lunar.isConnected) await setPrivateData(lunar.address);
    // eslint-disable-next-line no-console
    console.log(`lunar.isConnected: ${lunar.isConnected}`);
    */
    // eslint-disable-next-line no-console
    console.log(`app init is called: isDeWTLegit${isDeWTLegit}, signer${signer}`);
    if (isDeWTLegit && signer && deWT) await setPrivateData(signer, deWT);
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
