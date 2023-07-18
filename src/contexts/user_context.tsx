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
import {Code, Reason} from '../constants/code';
import {
  getCookieByName,
  getServiceTermContract,
  getTimestamp,
  randomHex,
  rlpEncodeServiceTerm,
  toChecksumAddress,
  validateCFD,
  verifySignedServiceTerm,
} from '../lib/common';
import {IAcceptedOrder} from '../interfaces/tidebit_defi_background/accepted_order';
import {
  ICFDOrder,
  IDepositOrder,
  IWithdrawOrder,
} from '../interfaces/tidebit_defi_background/order';
import {CustomError, isCustomError} from '../lib/custom_error';
import {IWalletExtension, WalletExtension} from '../constants/wallet_extension';
import {Events} from '../constants/events';
import {IUser} from '../interfaces/tidebit_defi_background/user';
import {IUserAssets} from '../interfaces/tidebit_defi_background/user_assets';
import {IPersonalAchievement} from '../interfaces/tidebit_defi_background/personal_achievement';
import {IBadge} from '../interfaces/tidebit_defi_background/badge';
import {IPnL} from '../interfaces/tidebit_defi_background/pnl';
import {OrderType} from '../constants/order_type';
import {ICFDReceipt} from '../interfaces/tidebit_defi_background/receipt';

export interface IUserProvider {
  children: React.ReactNode;
}
export interface IUserContext {
  isInit: boolean;
  isLoadingCFDs: boolean;
  user: IUser | null;
  userAssets: IUserAssets | null;
  walletBalances: IWalletBalance[] | null;
  balances: IBalance[] | null;
  favoriteTickers: string[];
  isConnected: boolean;
  enableServiceTerm: boolean;
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
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
  listHistories: () => Promise<IResult>;
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
  getPersonalAchievements: (userId: string) => Promise<IResult>;
  init: () => Promise<void>;
  enableShare: (cfdId: string, share: boolean) => Promise<IResult>;
  shareTradeRecord: (cfdId: string) => Promise<IResult>;
  getBadge: (badgeId: string) => Promise<IResult>;
  walletExtensions: IWalletExtension[];
}

export const UserContext = createContext<IUserContext>({
  isInit: false,
  isLoadingCFDs: false,
  user: null,
  walletBalances: null,
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
  getBadge: function (badgeId: string): Promise<IResult> {
    throw new Error('Function not implemented.');
  },
});

export const UserProvider = ({children}: IUserProvider) => {
  const transactionEngine = React.useMemo(() => TransactionEngineInstance, []);
  const workerCtx = useContext(WorkerContext);
  const notificationCtx = useContext(NotificationContext);
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);
  const [isLoadingCFDs, setIsLoadingCFDs, isLoadingCFDsRef] = useState<boolean>(false);
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
  const [CFDs, setCFDs, CFDsRef] = useState<{[orderId: string]: ICFDOrder}>({});
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
      await listFavoriteTickers();
      if (selectedTickerRef.current) await listCFDs(selectedTickerRef.current.instId);

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
    const checksumAddress = toChecksumAddress(address);
    // Deprecate: [debug] (20230524 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(
      `accountsChanged checksumAddress: ${checksumAddress}, userRef.current?.address: ${userRef.current?.address}`
    );
    if (!!userRef.current && checksumAddress !== userRef.current.address) {
      // Deprecate: [debug] (20230524 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(
        `userRef.current: ${JSON.stringify(
          userRef.current
        )} !!userRef.current(${!!userRef.current}) && checksumAddress !== userRef.current?.address ${
          !!userRef.current && checksumAddress !== userRef.current?.address
        }? clearPrivateData`
      );
      clearPrivateData();
    }
  });

  const privateRequestHandler = useCallback(async (data: TypeRequest) => {
    try {
      const isDeWTLegit = checkDeWT();
      // Deprecate: [debug] (20230717 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`privateRequestHandler isDeWTLegit`, isDeWTLegit);
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
      // Deprecate: [debug] (20230717 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`privateRequestHandler error`, error);
      throw error;
    }
  }, []);

  const listFavoriteTickers = useCallback(async () => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        const tickers = (await privateRequestHandler({
          name: APIName.LIST_FAVORITE_TICKERS,
          method: Method.GET,
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

  const listCFDs = useCallback(async (instId: string) => {
    setIsLoadingCFDs(true);
    let result: IResult = {...defaultResultFailed};
    result.code = Code.SERVICE_TERM_DISABLE;
    result.reason = Reason[result.code];
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.LIST_CFD_TRADES,
          method: Method.GET,
          query: {
            ticker: instId,
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
    setIsLoadingCFDs(false);
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

  const getUserAssets = useCallback(async (): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await privateRequestHandler({
          name: APIName.GET_USER_ASSETS,
          method: Method.GET,
        })) as IResult;
        /**  Deprecate: after this functions finishing (20230508 - tzuhan)
        // eslint-disable-next-line no-console
        console.log(`getUserAssets result`, result);
        */
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

  /**
   * Deprecated: this function is unused (20230620 - tzuhan)
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
  */

  /**
   * Deprecated: this function is unused (20230620 - tzuhan)
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
  */

  const getBadge = useCallback(async (badgeId: string): Promise<IResult> => {
    let result: IResult = {...defaultResultFailed};
    if (enableServiceTermRef.current) {
      try {
        result = (await await workerCtx.requestHandler({
          name: APIName.GET_BADGE,
          method: Method.GET,
          params: badgeId,
        })) as IResult;
        if (result.success) {
          const badge = result.data as IBadge;
          result.data = badge;
        }
      } catch (error) {
        // TODO: error handle (Tzuhan - 20230421)
        // eslint-disable-next-line no-console
        console.error(`getBadge error`, error);
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
      const [encodedData, signature] = deWT.split('.');
      // 2. decode and verify signed serviceTermContract
      const result = verifySignedServiceTerm(encodedData);
      // Deprecated: (20230717 - tzuhan) [debug]
      // eslint-disable-next-line no-console
      console.log(`checkDeWT: `, ` result: `, result);
      isDeWTLegit = result.isDeWTLegit;
      if (isDeWTLegit && result.serviceTerm?.message?.signer) {
        signer = toChecksumAddress(result.serviceTerm.message.signer);
        // Deprecated: (20230717 - tzuhan) [debug]
        // eslint-disable-next-line no-console
        console.log(`checkDeWT: `, ` signer: `, signer);
        // 3. verify signature with recreate serviceTermContract
        const serviceTermContractTemplate = getServiceTermContract(lunar.address);
        const serviceTermContract = {
          ...serviceTermContractTemplate,
          ...result.serviceTerm,
        };
        const verifyR = lunar.verifyTypedData(serviceTermContract, `0x${signature}`);
        // Deprecated: (20230717 - tzuhan) [debug]
        // eslint-disable-next-line no-console
        console.log(`checkDeWT: `, ` verifyR: `, verifyR);
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
    document.cookie = `DeWT=${deWT}; path=/;`;
  };

  const signServiceTerm = async (): Promise<IResult> => {
    let eip712signature: string;
    let resultCode = Code.UNKNOWN_ERROR;
    let result: IResult = {...defaultResultFailed, code: resultCode, reason: Reason[resultCode]};

    try {
      if (lunar.isConnected) {
        const serviceTermContract = getServiceTermContract(lunar.address);
        const encodedData = rlpEncodeServiceTerm(serviceTermContract);
        resultCode = Code.SERVICE_TERM_DISABLE;
        eip712signature = await lunar.signTypedData(serviceTermContract);
        resultCode = Code.FAILED_TO_VERIFY_SIGNATURE;
        const verifyR: boolean = lunar.verifyTypedData(serviceTermContract, eip712signature);
        // eslint-disable-next-line no-console
        console.log(`verifyR`, verifyR);
        if (verifyR) {
          const deWT = `${encodedData}.${eip712signature.replace('0x', '')}`;
          setDeWT(deWT);
          await setPrivateData(lunar.address, deWT);
          resultCode = Code.SUCCESS;
          result = {
            success: true,
            code: resultCode,
          };
        } else {
          result.code = resultCode;
          result.reason = Reason[resultCode];
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

  const getCFD = (id: string) => {
    let CFD: ICFDOrder | null = CFDsRef.current[id] ?? null;
    if (!CFD) CFD = openCFDsRef.current.find(openCFD => openCFD.id === id) ?? null;
    if (!CFD) CFD = closedCFDsRef.current.find(closeCFD => closeCFD.id === id) ?? null;
    return CFD;
  };

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
          } else throw new CustomError(Code.BALANCE_NOT_FOUND);
        } else throw new CustomError(Code.BALANCE_NOT_FOUND);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('error in updateBalance in ctx', error);
        throw new CustomError(Code.FAILE_TO_UPDATE_BALANCE);
      }
    }
  };

  // Deprecated: fee depends on the PNL when closing the position `validateCFD` (20230617 - Shirley)
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
    let result: IResult;
    try {
      const isValid = validateCFD(applyCreateCFDOrder?.fee ?? 0, applyCreateCFDOrder?.amount ?? 0);
      if (!isValid) throw new CustomError(Code.INVALID_CFD_OPEN_REQUEST);
      if (!enableServiceTermRef.current) throw new CustomError(Code.SERVICE_TERM_DISABLE);
      if (!applyCreateCFDOrder) throw new CustomError(Code.INVAILD_ORDER_INPUTS);
      const balance: IBalance | null = getBalance(applyCreateCFDOrder.margin.asset);
      if (!balance || balance.available < applyCreateCFDOrder.margin.amount)
        throw new CustomError(Code.BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER);
      const typeData = transactionEngine.transferCFDOrderToTransaction(applyCreateCFDOrder);
      if (!typeData) throw new CustomError(Code.FAILED_TO_CREATE_TRANSACTION);
      const signature: string = await lunar.signTypedData(typeData);
      /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
      const success = lunar.verifyTypedData(typeData, signature);
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log('_createCFDOrder lunar.verifyTypedData success', success, `typeData`, typeData);
      if (!success) throw new CustomError(Code.REJECTED_SIGNATURE);
      const now = getTimestamp();
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log(
        `_createCFDOrder applyCreateCFDOrder.quotation.deadline(${
          applyCreateCFDOrder.quotation.deadline
        }) ${new Date(applyCreateCFDOrder.quotation.deadline * 1000)} < now${now}`,
        applyCreateCFDOrder.quotation.deadline < now
      );
      if (applyCreateCFDOrder.quotation.deadline < now)
        throw new CustomError(Code.EXPIRED_QUOTATION_FAILED);
      result = (await privateRequestHandler({
        name: APIName.CREATE_CFD_TRADE,
        method: Method.POST,
        body: {applyData: applyCreateCFDOrder, userSignature: signature},
      })) as IResult;
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log('_createCFDOrder result', result);
      if (!result.success)
        throw new CustomError(
          isCustomError(result.code) ? result.code : Code.INTERNAL_SERVER_ERROR
        );
      const {balanceSnapshot, orderSnapshot: CFDOrder} = result.data as {
        txhash: string;
        orderSnapshot: ICFDOrder;
        balanceSnapshot: IBalance[];
      };
      const index = openCFDsRef.current.findIndex(cfd => cfd.id === CFDOrder.id);
      if (index === -1) setOpenedCFDs(prev => [...prev, CFDOrder]);
      result.code = Code.FAILE_TO_UPDATE_BALANCE;
      updateBalance(balanceSnapshot);
      result.code = Code.SUCCESS;
      result = {
        success: true,
        code: result.code,
        data: {order: CFDOrder},
      };
    } catch (error) {
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };
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
    let result: IResult;
    try {
      if (!enableServiceTermRef.current) throw new CustomError(Code.SERVICE_TERM_DISABLE);
      if (!applyCloseCFDOrder) throw new CustomError(Code.INVAILD_ORDER_INPUTS);
      const closeAppliedCFD = getCFD(applyCloseCFDOrder.referenceId);
      if (!closeAppliedCFD) throw new CustomError(Code.CFD_ORDER_NOT_FOUND);
      if (closeAppliedCFD.state !== OrderState.OPENING)
        throw new CustomError(Code.CFD_ORDER_IS_ALREADY_CLOSED);
      // const balance: IBalance | null = getBalance(openCFDs[index].targetAsset);
      const typeData = transactionEngine.transferCFDOrderToTransaction(applyCloseCFDOrder);
      if (!typeData) throw new CustomError(Code.FAILED_TO_CREATE_TRANSACTION);
      // TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
      const signature: string = await lunar.signTypedData(typeData);
      /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
      const success = lunar.verifyTypedData(typeData, signature);
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log('closeCFDOrder lunar.verifyTypedData success', success, `typeData`, typeData);
      if (!success) throw new CustomError(Code.REJECTED_SIGNATURE);
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
      if (applyCloseCFDOrder.quotation.deadline < now)
        throw new CustomError(Code.EXPIRED_QUOTATION_FAILED);
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
      if (!result.success)
        throw new CustomError(
          isCustomError(result.code) ? result.code : Code.INTERNAL_SERVER_ERROR
        );
      const {balanceSnapshot, orderSnapshot: updateCFDOrder} = result.data as {
        txhash: string;
        orderSnapshot: ICFDOrder;
        balanceSnapshot: IBalance[];
      };
      const newOpenedCFDs = [...openCFDsRef.current];
      let index = newOpenedCFDs.findIndex(o => o.id === updateCFDOrder.id);
      if (index !== -1) newOpenedCFDs.splice(index, 1);
      setOpenedCFDs(newOpenedCFDs);
      index = closedCFDsRef.current.findIndex(o => o.id === updateCFDOrder.id);
      if (index === -1) setClosedCFDs(prev => [...prev, {...updateCFDOrder}]);
      updateBalance(balanceSnapshot);
      setCFDs({...CFDsRef.current, [updateCFDOrder.id]: {...updateCFDOrder}});
      result = {
        success: true,
        code: Code.SUCCESS,
        data: {order: {...updateCFDOrder}},
      };
    } catch (error) {
      // Info: `updateBalance` has two options of error (20230426 - Shirley)
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };
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
    let result: IResult;
    try {
      if (!enableServiceTermRef.current) throw new CustomError(Code.SERVICE_TERM_DISABLE);
      if (!applyUpdateCFDOrder) throw new CustomError(Code.INVAILD_ORDER_INPUTS);
      const updateAppliedCFD = getCFD(applyUpdateCFDOrder.referenceId);
      if (!updateAppliedCFD) throw new CustomError(Code.CFD_ORDER_NOT_FOUND);
      if (updateAppliedCFD.state !== OrderState.OPENING)
        throw new CustomError(Code.CFD_ORDER_IS_ALREADY_CLOSED);
      const typeData = transactionEngine.transferCFDOrderToTransaction(applyUpdateCFDOrder);
      if (!typeData) throw new CustomError(Code.FAILED_TO_CREATE_TRANSACTION);
      // TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
      const signature: string = await lunar.signTypedData(typeData);
      /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
      const success = lunar.verifyTypedData(typeData, signature);
      // Deprecated: [debug] (20230509 - Tzuhan)
      // eslint-disable-next-line no-console
      console.log('updateCFDOrder lunar.verifyTypedData success', success, `typeData`, typeData);
      if (!success) throw new CustomError(Code.REJECTED_SIGNATURE);
      result = (await privateRequestHandler({
        name: APIName.UPDATE_CFD_TRADE,
        method: Method.PUT,
        body: {
          applyData: applyUpdateCFDOrder,
          userSignature: signature,
        },
      })) as IResult;
      if (!result.success)
        throw new CustomError(
          isCustomError(result.code) ? result.code : Code.INTERNAL_SERVER_ERROR
        );
      const {orderSnapshot: updateCFDOrder} = result.data as {
        txhash: string;
        orderSnapshot: ICFDOrder;
        balanceSnapshot: IBalance[];
      };
      const updateCFDOrders = [...openCFDs];
      const index = updateCFDOrders.findIndex(o => o.id === updateCFDOrder.id);
      if (index !== -1) updateCFDOrders[index] = updateCFDOrder;
      setOpenedCFDs(updateCFDOrders);
      setCFDs({...CFDsRef.current, [updateCFDOrder.id]: {...updateCFDOrder}});
      result.code = Code.SUCCESS;
      result = {
        success: true,
        code: result.code,
        data: {order: updateCFDOrder},
      };
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

    return result;
  };

  const deposit = async (applyDepositOrder: IApplyDepositOrder): Promise<IResult> => {
    let result: IResult;
    try {
      if (!enableServiceTermRef.current) throw new CustomError(Code.SERVICE_TERM_DISABLE);
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
      if (result.success) {
        const depositOrder = result.data as IDepositOrder;
        setDeposits(prev => [...prev, depositOrder]);
      }
    } catch (error) {
      result = {
        success: false,
        code: isCustomError(error) ? error.code : Code.INTERNAL_SERVER_ERROR,
        reason: isCustomError(error)
          ? Reason[error.code]
          : (error as Error)?.message || Reason[Code.INTERNAL_SERVER_ERROR],
      };
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
        const typeData = transactionEngine.transferWithdrawOrderToTransaction(applyWithdrawOrder);
        if (typeData) {
          // ++ TODO: send request to chain(use Lunar?) (20230324 - tzuhan)
          try {
            result.code = Code.REJECTED_SIGNATURE;
            const signature: string = await lunar.signTypedData(typeData);
            /* Info: (20230505 - Julian) 需要再驗證一次簽名是否正確 */
            const success = await lunar.verifyTypedData(typeData, signature);
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
          const CFDs = histories
            .filter(history => history.orderType === OrderType.CFD)
            .reduce((acc, history) => {
              const receipt = history.receipt as ICFDReceipt;
              const orderSnapshot = receipt.orderSnapshot as ICFDOrder;
              if (!acc[orderSnapshot.id]) acc[orderSnapshot.id] = orderSnapshot;
              else {
                if (orderSnapshot.updatedTimestamp > acc[orderSnapshot.id].updatedTimestamp) {
                  acc[orderSnapshot.id] = orderSnapshot;
                }
              }
              return acc;
            }, {} as {[orderId: string]: ICFDOrder});
          setCFDs(CFDs);
          // Deprecate: [debug] (20230707 - tzuhan)
          // eslint-disable-next-line no-console
          console.log(`listHistories CFDs`, CFDs);
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

  const updateUserAssetsHandler = useCallback(
    (userAssetsBrief: {
      available: number;
      locked: number;
      PnL?: {amount: IPnL; percentage: IPnL};
    }) => {
      if (!userAssetsRef.current) return;
      const userAssets = {...userAssetsRef.current};
      userAssets.balance.available = userAssetsBrief.available;
      userAssets.balance.locked = userAssetsBrief.locked;
      if (userAssetsBrief.PnL) userAssets.pnl.cumulative = userAssetsBrief.PnL;
      setUserAssets({...userAssets});
    },
    []
  );

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
    }
  }, []);

  const updateCFDHandler = useCallback((updateCFD: ICFDOrder) => {
    const _updateCFD = {...updateCFD};
    let updatedCFDs: ICFDOrder[] = [];
    if (openCFDsRef.current) {
      updatedCFDs = [...updatedCFDs, ...openCFDsRef.current];
    }
    if (closedCFDsRef.current) {
      updatedCFDs = [...updatedCFDs, ...closedCFDsRef.current];
    }
    const index = updatedCFDs.findIndex(obj => obj.id === updateCFD.id);
    if (index !== -1) {
      updatedCFDs[index] = _updateCFD;
    } else {
      updatedCFDs.push(_updateCFD);
    }
    const openCFDs = updatedCFDs.filter(obj => obj.state === OrderState.OPENING);
    const closedCFDs = updatedCFDs.filter(obj => obj.state === OrderState.CLOSED);
    setOpenedCFDs(openCFDs);
    setClosedCFDs(closedCFDs);
  }, []);

  const updateHistoryHandler = useCallback((history: IAcceptedOrder) => {
    const index = historiesRef.current.findIndex(obj => obj.id === history.id);

    if (index === -1) {
      const updatedHistory: IAcceptedOrder[] = [...historiesRef.current];
      updatedHistory.push(history);
      setHistories(updatedHistory);
    }
  }, []);
  React.useMemo(() => notificationCtx.emitter.on(Events.ASSETS, updateUserAssetsHandler), []);
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
      notificationCtx.emitter.on(TideBitEvent.CHANGE_TICKER, async (ticker: ITickerData) => {
        if (!selectedTickerRef.current || ticker.instId !== selectedTickerRef.current?.instId) {
          setSelectedTicker(ticker);
          setOpenedCFDs([]);
          setClosedCFDs([]);
          setIsLoadingCFDs(true);
        }
      }),
    []
  );

  React.useMemo(
    () =>
      notificationCtx.emitter.on(TideBitEvent.TICKER_CHANGE, async (ticker: ITickerData) => {
        await listCFDs(ticker.instId);
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
    setIsInit(true);
    return await Promise.resolve();
  };

  const defaultValue = {
    isInit: isInitRef.current,
    isLoadingCFDs: isLoadingCFDsRef.current,
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
    getPersonalAchievements,
    // getTotalBalance,
    getBadge,
    init,
    walletExtensions: walletExtensionsRef.current,
  };

  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
