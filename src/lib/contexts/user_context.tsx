/* eslint-disable no-console */
import Lunar from '@cafeca/lunar';
import React, {useState, createContext} from 'react';
import {providers} from 'ethers';
import {ICardProps, ILineGraphProps} from '../../components/card/crypto_card';
import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';
import {
  dummyWalletBalancelist,
  IWalletBalance,
} from '../../interfaces/tidebit_defi_background/wallet_balance';
import {
  dummyFailedResult,
  dummySuccessResult,
  IResult,
} from '../../interfaces/tidebit_defi_background/result';
import {
  IListOpenCFDResult,
  IListClosedCFDResult,
  dummySuccessListOpenCFDBriefsResult,
  dummyFailedListOpenCFDBriefsResult,
  dummyFailedListClosedCFDBriefsResult,
  dummySuccessListClosedCFDBriefsResult,
} from '../../interfaces/tidebit_defi_background/list_cfd_result';
import {
  dummySuccessOpenCFDDetailsResult,
  dummySuccessClosedCFDDetailsResult,
  IOpenCFDDetailsResult,
  IClosedCFDDetailsResult,
} from '../../interfaces/tidebit_defi_background/cfd_details_result';
import {IOpenCFDBrief} from '../../interfaces/tidebit_defi_background/open_cfd_brief';
import {IClosedCFDBrief} from '../../interfaces/tidebit_defi_background/closed_cfd_brief';

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
  walletBalance: IWalletBalance[];
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
  listOpenCFDBriefs: () => Promise<IListOpenCFDResult>;
  listClosedCFDBriefs: () => Promise<IListClosedCFDResult>;
  getOpenCFD: (props: string) => Promise<IOpenCFDDetailsResult>;
  getClosedCFD: (props: string) => Promise<IClosedCFDDetailsResult>;
}

export const UserContext = createContext<IUserContext>({
  id: null,
  username: null,
  wallet: null,
  walletBalance: [],
  balance: null,
  favoriteTickers: [],
  isConnected: false,
  enableServiceTerm: false,
  openCFDBriefs: [],
  closedCFDBriefs: [],
  connect: () => Promise.resolve(true),
  signServiceTerm: () => Promise.resolve(true),
  disconnect: () => Promise.resolve(true),
  addFavorites: (props: string) => dummySuccessResult,
  removeFavorites: (props: string) => dummySuccessResult,
  listOpenCFDBriefs: () => Promise.resolve<IListOpenCFDResult>(dummySuccessListOpenCFDBriefsResult),
  listClosedCFDBriefs: () =>
    Promise.resolve<IListClosedCFDResult>(dummyFailedListClosedCFDBriefsResult),
  getOpenCFD: (props: string) =>
    Promise.resolve<IOpenCFDDetailsResult>(dummySuccessOpenCFDDetailsResult),
  getClosedCFD: (props: string) =>
    Promise.resolve<IClosedCFDDetailsResult>(dummySuccessClosedCFDDetailsResult),
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<IWalletBalance[]>([]);
  const [balance, setBalance] = useState<IUserBalance | null>(null);
  const [favoriteTickers, setFavoriteTickers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [enableServiceTerm, setEnableServiceTerm] = useState<boolean>(false);
  const [openCFDBriefs, setOpenedCFDBriefs] = useState<Array<IOpenCFDBrief>>([]);
  const [closedCFDBriefs, setClosedCFDBriefs] = useState<Array<IClosedCFDBrief>>([]);

  const listOpenCFDBriefs = async () => {
    let result: IListOpenCFDResult = dummyFailedListOpenCFDBriefsResult;
    // let openCFDBriefs: IOpenCFDBrief[] = [];
    if (isConnected) {
      result = await Promise.resolve<IListOpenCFDResult>(dummySuccessListOpenCFDBriefsResult);
      // if (result.success) openCFDBriefs = result.data;
    }
    return result;
  };

  const listClosedCFDBriefs = async () => {
    let result: IListClosedCFDResult = dummyFailedListClosedCFDBriefsResult;
    //let result:IClosedCFD
    // let closedCFDBriefs: IClosedCFDBrief[] = [];
    if (isConnected) {
      result = await Promise.resolve<IListClosedCFDResult>(dummySuccessListClosedCFDBriefsResult);
      //   if (result.success) closedCFDBriefs = result.data;
    }
    return result;
  };

  const connect = async () => {
    let success = false;
    try {
      const lunar = new Lunar();
      const connect = true;
      lunar.connect({});
      setIsConnected(connect);
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);

      if (connect) {
        const openCFDsResult = await listOpenCFDBriefs();
        const closedCFDsResult = await listClosedCFDBriefs();
        setId('002');
        setUsername('Tidebit DeFi Test User');
        setWallet('0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30');
        setWalletBalance(dummyWalletBalancelist);
        setBalance({
          available: 1296.47,
          locked: 583.62,
          PNL: 1956.84,
        });
        setOpenedCFDBriefs(openCFDsResult.data);
        setClosedCFDBriefs(closedCFDsResult.data);
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
      setIsConnected(false);
      setEnableServiceTerm(false);
      setId(null);
      setUsername(null);
      setWallet(null);
      setWalletBalance([]);
      setBalance(null);
      setOpenedCFDBriefs([]);
      setClosedCFDBriefs([]);
      success = true;
    } catch (error) {
      console.error(`userContext disconnect error`, error);
    }
    return success;
  };

  const addFavorites = (newFavorite: string) => {
    let result: IResult = dummyFailedResult;
    if (isConnected) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
      result = dummySuccessResult;
    }
    return result;
  };

  const removeFavorites = (previousFavorite: string) => {
    let result: IResult = dummyFailedResult;
    if (isConnected) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(
        currency => currency === previousFavorite
      );
      if (index !== -1) {
        updatedFavoriteTickers.splice(index, 1);
        setFavoriteTickers(updatedFavoriteTickers);
        console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
        result = dummySuccessResult;
      }
    }
    return result;
  };

  // const getOpenCFD = async (props: string) => {
  //   const openCFDDetails: IOpenCFDDetailsResult = await Promise.resolve(dummySuccessOpenCFDDetailsResult);
  //   return openCFDDetails;
  // };
  const getOpenCFD = async (id: string) => dummySuccessOpenCFDDetailsResult;

  // const getClosedCFD = async (props: string) => {
  //   const closedCFDDetails: IClosedCFDDetailsResult = await Promise.resolve(dummySuccessClosedCFDDetailsResult);
  //   return closedCFDDetails;
  // };
  const getClosedCFD = async (id: string) => dummySuccessClosedCFDDetailsResult;

  const defaultValue = {
    id,
    username,
    wallet,
    walletBalance,
    balance,
    favoriteTickers,
    isConnected,
    enableServiceTerm,
    openCFDBriefs,
    closedCFDBriefs,
    addFavorites,
    removeFavorites,
    listOpenCFDBriefs,
    getOpenCFD,
    listClosedCFDBriefs,
    getClosedCFD,
    connect,
    signServiceTerm,
    disconnect,
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
