/* eslint-disable no-console */
import Lunar from '@cafeca/lunar';
import React, {createContext} from 'react';
import useState from 'react-usestateref';
import {providers} from 'ethers';
import {ICardProps, ILineGraphProps} from '../components/card/crypto_card';
import {PROFIT_LOSS_COLOR_TYPE} from '../constants/display';
import {
  dummyOpenCFDBriefs,
  IOpenCFDBrief,
} from '../interfaces/tidebit_defi_background/open_cfd_brief';
import {
  IOpenCFDDetails,
  dummyOpenCFDDetails,
} from '../interfaces/tidebit_defi_background/open_cfd_details';
import {
  dummyClosedCFDBriefs,
  IClosedCFDBrief,
} from '../interfaces/tidebit_defi_background/closed_cfd_brief';
import {
  IClosedCFDDetails,
  dummyCloseCFDDetails,
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
import {ICFDOrderCreatingProps} from '../interfaces/tidebit_defi_background/cfd_order_request';
import {IOrderStatusUnion} from '../interfaces/depre_tidebit_defi_background';
import {ICFDOrderUpdateRequest} from '../interfaces/tidebit_defi_background/cfd_order_update';
import {
  dummyBalance_BTC,
  dummyBalance_ETH,
  dummyBalance_USDT,
  IBalance,
} from '../interfaces/tidebit_defi_background/balance';
import {
  dummyPublicCFDOrder,
  dummyPublicDepositOrder,
  dummyPublicWithdrawOrder,
} from '../interfaces/tidebit_defi_background/public_order';
import {IOrderResult} from '../interfaces/tidebit_defi_background/order_result';

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
    return [PROFIT_LOSS_COLOR_TYPE.profit];
  }

  // priceColor = 'text-lightRed';
  return [PROFIT_LOSS_COLOR_TYPE.loss];
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
  openCFDBriefs: IOpenCFDBrief[];
  closedCFDBriefs: IClosedCFDBrief[];
  connect: () => Promise<boolean>;
  signServiceTerm: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  addFavorites: (props: string) => IResult;
  removeFavorites: (props: string) => IResult;
  listOpenCFDBriefs: () => Promise<IOpenCFDBrief[]>;
  listClosedCFDBriefs: () => Promise<IClosedCFDBrief[]>;
  // getOpendCFD: (props: string) => Promise<IOpenCFDDetails>;
  // getClosedCFD: (props: string) => Promise<IClosedCFDDetails>;
  getOpendCFD: (props: string) => IOpenCFDDetails;
  getClosedCFD: (props: string) => IClosedCFDDetails;

  // TODO:
  balances: IBalance[] | null;
  email: string | null;
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  getBalance: (props: string) => IBalance | null;
  getWalletBalance: (props: string) => IWalletBalance | null;
  createOrder: (props: ICFDOrderCreatingProps) => Promise<IOrderResult>;
  closeOrder: (props: {id: string}) => Promise<IOrderResult>;
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise<IOrderResult>;
  deposit: (props: {asset: string; amount: number}) => Promise<IOrderResult>;
  withdraw: (props: {asset: string; amount: number}) => Promise<IOrderResult>;
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
  openCFDBriefs: [],
  closedCFDBriefs: [],
  connect: () => Promise.resolve(true),
  signServiceTerm: () => Promise.resolve(true),
  disconnect: () => Promise.resolve(true),
  addFavorites: (props: string) => dummyResultSuccess,
  removeFavorites: (props: string) => dummyResultSuccess,
  listOpenCFDBriefs: () => Promise.resolve<IOpenCFDBrief[]>([]),
  listClosedCFDBriefs: () => Promise.resolve<IClosedCFDBrief[]>([]),
  // getOpendCFD: (props: string) => Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails),
  // getClosedCFD: (props: string) => Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails),
  getOpendCFD: (props: string) => dummyOpenCFDDetails,
  getClosedCFD: (props: string) => dummyCloseCFDDetails,

  // TODO:
  balances: null,
  email: null,
  isSubscibedNewsletters: false,
  isEnabledEmailNotification: false,
  isConnectedWithEmail: false,
  isConnectedWithTideBit: false,
  getBalance: (props: string) => null,
  getWalletBalance: (props: string) => null,
  createOrder: (props: ICFDOrderCreatingProps) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  closeOrder: (props: {id: string}) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  updateOrder: (props: ICFDOrderUpdateRequest) => Promise.resolve<IOrderResult>(dummyResultSuccess),
  deposit: (props: {asset: string; amount: number}) =>
    Promise.resolve<IOrderResult>(dummyResultSuccess),
  withdraw: (props: {asset: string; amount: number}) =>
    Promise.resolve<IOrderResult>(dummyResultSuccess),
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [walletBalances, setWalletBalances] = useState<IWalletBalance[] | null>(null);
  const [balance, setBalance] = useState<IUserBalance | null>(null);
  const [balances, setBalances] = useState<IBalance[] | null>(null);
  const [favoriteTickers, setFavoriteTickers] = useState<string[]>([]);
  const [isConnected, setIsConnected, isConnectedRef] = useState<boolean>(false);
  const [enableServiceTerm, setEnableServiceTerm] = useState<boolean>(false);
  const [openCFDBriefs, setOpenedCFDBriefs] = useState<Array<IOpenCFDBrief>>([]);
  const [closedCFDBriefs, setClosedCFDBriefs] = useState<Array<IClosedCFDBrief>>([]);
  const [isSubscibedNewsletters, setIsSubscibedNewsletters] = useState<boolean>(false);
  const [isEnabledEmailNotification, setIsEnabledEmailNotification] = useState<boolean>(false);
  const [isConnectedWithEmail, setIsConnectedWithEmail] = useState<boolean>(false);
  const [isConnectedWithTideBit, setIsConnectedWithTideBit] = useState<boolean>(false);

  const setPrivateData = async (wallet: string) => {
    setWallet(wallet);
    setWalletBalances([dummyWalletBalance_BTC, dummyWalletBalance_ETH, dummyWalletBalance_USDT]);
    // TODO getUser from backend by wallet
    setId('002');
    setUsername('Tidebit DeFi Test User');
    setBalance({
      available: 1296.47,
      locked: 583.62,
      PNL: 1956.84,
    });
    setBalances([dummyBalance_BTC, dummyBalance_ETH, dummyBalance_USDT]);
    const openedCFDs = await listOpenCFDBriefs();
    const closedCFDs = await listClosedCFDBriefs();
    setOpenedCFDBriefs(openedCFDs);
    setClosedCFDBriefs(closedCFDs);
  };

  const clearPrivateData = () => {
    setEnableServiceTerm(false);
    setId(null);
    setUsername(null);
    setWallet(null);
    setWalletBalances(null);
    setBalance(null);
    setOpenedCFDBriefs([]);
    setClosedCFDBriefs([]);
  };

  const lunar = new Lunar();
  lunar.on('connected', () => {
    setIsConnected(true);
    setPrivateData(lunar.address);
  });
  lunar.on('disconnected', () => {
    setIsConnected(false);
    clearPrivateData();
  });
  lunar.on('accountsChanged', () => {
    setPrivateData(lunar.address);
  });

  const listOpenCFDBriefs = async () => {
    let openCFDBriefs: IOpenCFDBrief[] = [];
    if (isConnectedRef.current) {
      openCFDBriefs = await Promise.resolve<IOpenCFDBrief[]>(dummyOpenCFDBriefs);
    }
    return openCFDBriefs;
  };

  const listClosedCFDBriefs = async () => {
    let closedCFDBriefs: IClosedCFDBrief[] = [];
    if (isConnectedRef.current) {
      closedCFDBriefs = await Promise.resolve<IClosedCFDBrief[]>(dummyClosedCFDBriefs);
    }
    return closedCFDBriefs;
  };

  const connect = async () => {
    let success = false;
    try {
      const connect = await lunar.connect({});
      const address = lunar.address;
      if (connect) {
        success = true;
      }
    } catch (error) {
      console.error(`userContext connect error`, error);
    }
    return success;
  };

  const signServiceTerm = async () => {
    setEnableServiceTerm(true);
    return true;
  };

  const disconnect = async () => {
    let success = false;
    try {
      await lunar.disconnect();
      success = true;
    } catch (error) {
      console.error(`userContext disconnect error`, error);
    }
    return success;
  };

  const addFavorites = (newFavorite: string) => {
    let result: IResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
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
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
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
    if (walletBalances) {
      const index: number = walletBalances.findIndex(wb => wb.currency === props);
      if (index !== -1) walletBalance = walletBalances[index];
    }
    return walletBalance;
  };

  const getBalance = (props: string) => {
    let balance: IBalance | null = null;
    if (balances) {
      const index: number = balances.findIndex(wb => wb.currency === props);
      if (index !== -1) balance = balances[index];
    }
    return balance;
  };

  const createOrder = async (props: ICFDOrderCreatingProps) => {
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

  const deposit = async (props: {asset: string; amount: number}) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const walletBalance: IWalletBalance | null = getWalletBalance(props.asset);
      // if(balance is enough)
      if (walletBalance && walletBalance.balance >= props.amount) {
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

  const withdraw = async (props: {asset: string; amount: number}) => {
    let result: IOrderResult = dummyResultFailed;
    if (isConnectedRef.current) {
      const balance: IBalance | null = getBalance(props.asset); // TODO: ticker is not currency
      if (balance && balance.available >= props.amount) {
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

  const defaultValue = {
    id,
    username,
    wallet,
    walletBalances,
    balance,
    balances,
    favoriteTickers,
    isConnected,
    enableServiceTerm,
    openCFDBriefs,
    closedCFDBriefs,
    email,
    isSubscibedNewsletters,
    isEnabledEmailNotification,
    isConnectedWithEmail,
    isConnectedWithTideBit,
    addFavorites,
    removeFavorites,
    listOpenCFDBriefs,
    getOpendCFD,
    listClosedCFDBriefs,
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
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
