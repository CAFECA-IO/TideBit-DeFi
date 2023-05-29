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
import {
  IBalance,
  IBalanceDetails,
  convertBalanceDetailsToBalance,
  isIBalance,
} from '../interfaces/tidebit_defi_background/balance';
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
  millesecondsToSeconds,
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
import {ProfitState, getProfitState} from '../constants/profit_state';
import {IRankingTimeSpan} from '../constants/ranking_time_span';
import {IUserAssets, getDummyUserAssets} from '../interfaces/tidebit_defi_background/user_assets';
import {
  IPersonalRanking,
  getDummyPersonalRanking,
} from '../interfaces/tidebit_defi_background/personal_ranking';
import {
  IPersonalAchievement,
  getDummyPersonalAchievements,
} from '../interfaces/tidebit_defi_background/personal_achievement';

export interface IUserProvider {
  children: React.ReactNode;
}
export interface IUserContext {
  user: IUser | null;
  userAssets: IUserAssets | null;
  walletBalances: IWalletBalance[] | null;
  // balance: IUserBalance | null;
  balances: IBalance[] | null;
  favoriteTickers: string[];
  isConnected: boolean;
  enableServiceTerm: boolean;
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
  readNotifications: (notifications: INotificationItem[]) => Promise<IResult>;
  getBalance: (currency: string) => IBalance | null;
  getWalletBalance: (props: string) => IWalletBalance | null;
  getUserAssets: () => Promise<IResult>;
  getPersonalRanking: (userId: string, timeSpan: IRankingTimeSpan) => Promise<IResult>;
  getPersonalAchievements: (userId: string) => Promise<IResult>;
  init: () => Promise<void>;
  enableShare: (cfdId: string, share: boolean) => Promise<IResult>;
  shareTradeRecord: (cfdId: string) => Promise<IResult>;
  // getTotalBalance: () => Promise<IResult>;
  walletExtensions: IWalletExtension[];
}

export const UserContext = createContext<IUserContext>({
  user: null,
  walletBalances: null,
  // balance: null,
  userAssets: null,
  balances: null,
  favoriteTickers: [],
  isConnected: false,
  enableServiceTerm: false,
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
  readNotifications: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  getBalance: () => null,
  getWalletBalance: () => null,
  getPersonalRanking: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  getPersonalAchievements: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  init: () => Promise.resolve(),
  enableShare: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  shareTradeRecord: (): Promise<IResult> => {
    throw new CustomError(Code.FUNCTION_NOT_IMPLEMENTED);
  },
  walletExtensions: [],
  getUserAssets: function (): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
});

export const UserProvider = ({children}: IUserProvider) => {
  const tickerBook = React.useMemo(() => TickerBookInstance, []);
  const transactionEngine = React.useMemo(() => TransactionEngineInstance, []);
  const workerCtx = useContext(WorkerContext);
  const notificationCtx = useContext(NotificationContext);
  const [user, setUser, userRef] = useState<IUser | null>(null);
  const [walletBalances, setWalletBalances, walletBalancesRef] = useState<IWalletBalance[] | null>(
    null
  );
  const [userAssets, setUserAssets, userAssetsRef] = useState<IUserAssets | null>(null);
  // const [balance, setBalance, balanceRef] = useState<IUserBalance | null>(null);
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
    // Deprecate: [debug] (20230524 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(`setPrivateData deWTLogin result`, result);
    if (result.success) {
      const {user, expiredAt} = result.data as {user: IUser; expiredAt: string};
      const expiredAtDate = new Date(expiredAt);
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`deWTLogin expiredAtDate: ${expiredAtDate}, user`, user);
      // TODO: setTimeOut to clearPrivateData() (20230508 - tzuhan)
      setUser(user);

      setEnableServiceTerm(true);
      setWalletBalances([dummyWalletBalance_BTC, dummyWalletBalance_ETH, dummyWalletBalance_USDT]);

      await getUserAssets();
      await listBalances();
      if (selectedTickerRef.current) {
        await listCFDs(selectedTickerRef.current.currency);
      }
      await listFavoriteTickers();
      await listHistories();

      workerCtx.subscribeUser(address);
    } else {
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log('setPrivateData deWTLogin.result.success false => clearPrivateData');
      clearPrivateData();
    }
  };

  const clearPrivateData = () => {
    // clear DeWT
    setDeWT('');
    setEnableServiceTerm(false);
    setUser(null);
    setWalletBalances(null);
    // setBalance(null);
    setUserAssets(null);
    setOpenedCFDs([]);
    setClosedCFDs([]);
    setFavoriteTickers([]);
    notificationCtx.emitter.emit(TideBitEvent.DISCONNECTED);
  };

  const lunar = Lunar.getInstance();
  lunar.on('connected', async () => {
    setIsConnected(true);
    if (!userRef.current) {
      const {isDeWTLegit, signer, deWT} = checkDeWT();
      if (isDeWTLegit && signer && deWT) await setPrivateData(signer, deWT);
    }
  });
  lunar.on('disconnected', () => {
    // Deprecate: [debug] (20230524 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(`lunar.on('disconnected') => clearPrivateData`);
    setIsConnected(false);
    clearPrivateData();
  });
  lunar.on('accountsChanged', async (address: string) => {
    // Deprecate: [debug] (20230524 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(
      `accountsChanged address: ${address}, userRef.current?.address: ${userRef.current?.address}`
    );
    if (!!userRef.current && address !== userRef.current.address) {
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(
        `userRef.current: ${JSON.stringify(
          userRef.current
        )} !!userRef.current(${!!userRef.current}) && address !== userRef.current?.address ${
          !!userRef.current && address !== userRef.current?.address
        }? clearPrivateData`
      );
      clearPrivateData();
    }
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
    const dayString = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
    const dayBegin = millesecondsToSeconds(new Date(`${dayString} 00:00:00`).getTime());
    const dayEnd = millesecondsToSeconds(new Date(`${dayString} 23:59:59`).getTime());
    const monthBegin = millesecondsToSeconds(
      new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01 00:00:00`).getTime()
    );
    const monthEnd = millesecondsToSeconds(
      new Date(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`
      ).getTime()
    );
    let dayPnLValue = 0,
      monthPnLValue = 0,
      PnLValue = 0;
    if (balancesRef.current && userAssetsRef.current) {
      for (const balance of balancesRef.current) {
        const rate = tickerBook.getCurrencyRate(balance.currency);
        sumAvailable += balance.available * rate;
        sumLocked += balance.locked * rate;
      }
      for (const closedCFD of closedCFDsRef.current) {
        if (closedCFD.closeTimestamp! >= dayBegin && closedCFD.closeTimestamp! <= dayEnd) {
          dayPnLValue += closedCFD.pnl?.value || 0;
        }
        if (closedCFD.closeTimestamp! >= monthBegin && closedCFD.closeTimestamp! <= monthEnd) {
          monthPnLValue += closedCFD.pnl?.value || 0;
        }
        PnLValue += closedCFD.pnl?.value || 0;
      }
      const updateUserAssets: IUserAssets = {
        ...userAssetsRef.current,
        balance: {
          available: sumAvailable,
          locked: sumLocked,
        },
        pnl: {
          ...userAssetsRef.current.pnl,
          today: {
            amount: {
              type: getProfitState(dayPnLValue),
              value: dayPnLValue,
            },
            percentage: {
              type: getProfitState(dayPnLValue),
              value: dayPnLValue / (sumAvailable + sumLocked),
            },
          },
          monthly: {
            amount: {
              type: getProfitState(monthPnLValue),
              value: monthPnLValue,
            },
            percentage: {
              type: getProfitState(monthPnLValue),
              value: monthPnLValue / (sumAvailable + sumLocked),
            },
          },
          cumulative: {
            amount: {
              type: getProfitState(PnLValue),
              value: PnLValue,
            },
            percentage: {
              type: getProfitState(PnLValue),
              value: PnLValue / (sumAvailable + sumLocked),
            },
          },
        },
      };
      setUserAssets(updateUserAssets);
    }
  };

  const getUserAssets = useCallback(async (): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.GET_USER_ASSETS,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`getUserAssets result`, result);
        if (result.success) {
          const userAssets = result.data as IUserAssets;
          setUserAssets(userAssets);
          result.data = userAssets;
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`getUserAssets error`, error);
        if (!isCustomError(error)) {
          result.code = Code.INTERNAL_SERVER_ERROR;
          result.reason = Reason[result.code];
        }
      }
    }
    return result;
  }, []);

  const getUserPnL = useCallback(async (): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.GET_USER_PNL,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`getUserPnL result`, result);
        if (result.success) {
          // const pnl = result.data as IPnL;
          // result.data = pnl;
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`getUserPnL error`, error);
        if (!isCustomError(error)) {
          result.code = Code.INTERNAL_SERVER_ERROR;
          result.reason = Reason[result.code];
        }
      }
    }
    return result;
  }, []);

  const getUserInterest = useCallback(async (): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.GET_USER_INTEREST,
          method: Method.GET,
        })) as IResult;
        // Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`getUserInterest result`, result);
        if (result.success) {
          // const interest = result.data as IInterest;
          // result.data = interest;
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`getUserInterest error`, error);
        if (!isCustomError(error)) {
          result.code = Code.INTERNAL_SERVER_ERROR;
          result.reason = Reason[result.code];
        }
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
        if (result.success) {
          const balances = (result.data as IBalanceDetails[]).map(detail =>
            convertBalanceDetailsToBalance(detail)
          );
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
      setIsConnected(connect);
      if (connect && lunar.isConnected) {
        resultCode = Code.DEWT_IS_NOT_LEGIT;
        if (!userRef.current) {
          const {isDeWTLegit, signer, deWT} = checkDeWT();
          if (isDeWTLegit && signer && deWT) await setPrivateData(signer, deWT);
        }
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
        const verifyR = lunar.verifyTypedData(serviceTermContract, `0x${signature}`);
        isDeWTLegit = isDeWTLegit && !!signer && verifyR;
      }
    }
    if (!isDeWTLegit) {
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`checkDeWT isDeWTLegit: ${isDeWTLegit} === false => clearPrivateData`);
      clearPrivateData();
    }
    return {isDeWTLegit, signer, deWT};
  };

  const deWTLogin = async (address: string, deWT: string) => {
    let result: IResult = {...defaultResultFailed};
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
      } catch (error) {
        result.success = false;
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
          // setEnableServiceTerm(true);
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
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`onClick disconnect => clearPrivateData`);
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


  /* ToDo: (20230510 - Julian) get data from backend */
  const getPersonalRanking = async (userId: string, timeSpan: IRankingTimeSpan) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_PERSONAL_RANKING,
        method: Method.GET,
        params: userId,
        query: {
          timeSpan,
        },
      })) as IResult;
      if (result.success) {
        const ranking = result.data as IPersonalRanking;
        result.data = ranking;
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`20230526 error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
  };

  /* ToDo: (20230517 - Julian) get data from backend */
  const getPersonalAchievements = async (userId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await workerCtx.requestHandler({
        name: APIName.GET_PERSONAL_ACHIEVEMENT,
        method: Method.GET,
        params: userId,
      })) as IResult;
      if (result.success) {
        const personalAchievement = result.data as IPersonalAchievement;
        result.data = personalAchievement;
      }
    } catch (error) {
      // Deprecate: error handle (Tzuhan - 20230321)
      // eslint-disable-next-line no-console
      console.error(`20230526 error`, error);
      result.code = Code.INTERNAL_SERVER_ERROR;
      result.reason = Reason[result.code];
    }
    return result;
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
  /**
   *
   * @param applyCreateCFDOrder
   * fee: <= margin.amount * 20% && >= 0
   * amount: >= 0
   * @returns
   */
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

  const enableShare = async (cfdId: string, share: boolean) => {
    let result: IResult = {...defaultResultFailed};
    try {
      result = (await privateRequestHandler({
        name: APIName.ENABLE_CFD_SHARE,
        method: Method.PUT,
        params: cfdId,
        body: {
          share: share,
        },
      })) as IResult;
    } catch (error) {
      result = {...defaultResultFailed};
    }
    return result;
  };

  const shareTradeRecord = async (cfdId: string) => {
    let result: IResult = {...defaultResultFailed};
    try {
      // TODO: call 3rd party api (Tzuhan - 20230317)
      result = (await privateRequestHandler({
        name: APIName.SHARE_CFD,
        method: Method.GET,
        params: cfdId,
      })) as IResult;
    } catch (error) {
      result = {...defaultResultFailed};
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

  const updateBalanceHandler = useCallback((updateBalanceDetails: IBalanceDetails) => {
    const updateBalance = convertBalanceDetailsToBalance(updateBalanceDetails);
    if (balancesRef.current) {
      const updatedBalances = [...balancesRef.current];
      const index = balancesRef.current.findIndex(obj => obj.currency === updateBalance.currency);
      if (index !== -1) {
        const updatedBalance = {
          ...balancesRef.current[index],
          ...updateBalance,
        };
        updatedBalances[index] = updatedBalance;
      } else updatedBalances.push(updateBalance);
      setBalances(updatedBalances);
      sumBalance();
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

  React.useMemo(() => notificationCtx.emitter.on(Events.BALANCE, updateBalanceHandler), []);
  React.useMemo(() => notificationCtx.emitter.on(Events.CFD, updateCFDHandler), []);
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
    // Deprecate: [debug] (20230524 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(
      `app init is called: lunar.isConnected: ${lunar.isConnected}, isDeWTLegit: ${isDeWTLegit}, signer: ${signer}`
    );
    if (isDeWTLegit && signer && deWT) await setPrivateData(signer, deWT);

    return await Promise.resolve();
  };

  const defaultValue = {
    user: userRef.current,
    walletBalances: walletBalancesRef.current,
    // balance: balanceRef.current,
    userAssets: userAssetsRef.current,
    balances: balancesRef.current,
    favoriteTickers: favoriteTickersRef.current,
    isConnected: isConnectedRef.current,
    enableServiceTerm: enableServiceTermRef.current,
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
    enableShare,
    shareTradeRecord,
    readNotifications,
    getBalance,
    getWalletBalance,
    getUserAssets,
    getPersonalRanking,
    getPersonalAchievements,
    // getTotalBalance,
    init,
    walletExtensions: walletExtensionsRef.current,
  };

  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
