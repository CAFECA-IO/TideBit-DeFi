/* eslint-disable no-console */
import Lunar from '@cafeca/lunar';
import React, {useState, createContext} from 'react';
import {providers} from 'ethers';
import {ICardProps, ILineGraphProps} from '../../components/card/crypto_card';
import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';
import {
  dummyOpenCFDBrief,
  IOpenCFDBrief,
} from '../../interfaces/tidebit_defi_background/open_cfd_brief';
import {
  IOpenCFDDetails,
  dummyOpenCFDDetails,
} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  dummyCloseCFDBrief,
  IClosedCFDBrief,
} from '../../interfaces/tidebit_defi_background/closed_cfd_brief';
import {
  IClosedCFDDetails,
  dummyCloseCFDDetails,
} from '../../interfaces/tidebit_defi_background/closed_cfd_details';

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
  walletBalance: number | null;
  balance: IUserBalance | null;
  favoriteTickers: string[];
  isConnected: boolean;
  enableServiceTerm: boolean;
  openCFDBriefs: IOpenCFDBrief[];
  closedCFDBriefs: IClosedCFDBrief[];
  connect: () => Promise<boolean>;
  signServiceTerm: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  addFavorites: (props: string) => void;
  removeFavorites: (props: string) => void;
  listOpenCFDBriefs: () => Promise<IOpenCFDBrief[]>;
  listClosedCFDBriefs: () => Promise<IClosedCFDBrief[]>;
  // getOpendCFD: (props: string) => Promise<IOpenCFDDetails>;
  // getClosedCFD: (props: string) => Promise<IClosedCFDDetails>;
  getOpendCFD: (props: string) => IOpenCFDDetails;
  getClosedCFD: (props: string) => IClosedCFDDetails;
}

export const UserContext = createContext<IUserContext>({
  id: null,
  username: null,
  wallet: null,
  walletBalance: null,
  balance: null,
  favoriteTickers: [],
  isConnected: false,
  enableServiceTerm: false,
  openCFDBriefs: [],
  closedCFDBriefs: [],
  connect: () => Promise.resolve(true),
  signServiceTerm: () => Promise.resolve(true),
  disconnect: () => Promise.resolve(true),
  addFavorites: (props: string) => null,
  removeFavorites: (props: string) => null,
  listOpenCFDBriefs: () => Promise.resolve<IOpenCFDBrief[]>([dummyOpenCFDBrief]),
  listClosedCFDBriefs: () => Promise.resolve<IClosedCFDBrief[]>([dummyCloseCFDBrief]),
  // getOpendCFD: (props: string) => Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails),
  // getClosedCFD: (props: string) => Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails),
  getOpendCFD: (props: string) => dummyOpenCFDDetails,
  getClosedCFD: (props: string) => dummyCloseCFDDetails,
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [balance, setBalance] = useState<IUserBalance | null>(null);
  const [favoriteTickers, setFavoriteTickers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [enableServiceTerm, setEnableServiceTerm] = useState<boolean>(false);
  const [openCFDBriefs, setOpenedCFDBriefs] = useState<Array<IOpenCFDBrief>>([]);
  const [closedCFDBriefs, setClosedCFDBriefs] = useState<Array<IClosedCFDBrief>>([]);

  const listOpenCFDBriefs = async () => {
    let openCFDBriefs: IOpenCFDBrief[] = [];
    if (isConnected) {
      openCFDBriefs = await Promise.resolve<IOpenCFDBrief[]>([dummyOpenCFDBrief]);
    }
    return openCFDBriefs;
  };

  const listClosedCFDBriefs = async () => {
    let closedCFDBriefs: IClosedCFDBrief[] = [];
    if (isConnected) {
      closedCFDBriefs = await Promise.resolve<IClosedCFDBrief[]>([dummyCloseCFDBrief]);
    }
    return closedCFDBriefs;
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
        const openedCFDs = await listOpenCFDBriefs();
        const closedCFDs = await listClosedCFDBriefs();
        setId('002');
        setUsername('Tidebit DeFi Test User');
        setWallet('0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30');
        setWalletBalance(894);
        setBalance({
          available: 1296.47,
          locked: 583.62,
          PNL: 1956.84,
        });
        setOpenedCFDBriefs(openedCFDs);
        setClosedCFDBriefs(closedCFDs);
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
      setWalletBalance(null);
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
    if (isConnected) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
    }
  };

  const removeFavorites = (previousFavorite: string) => {
    if (isConnected) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(
        currency => currency === previousFavorite
      );
      if (index !== -1) updatedFavoriteTickers.splice(index, 1);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
    }
  };

  // const getOpendCFD = async (props: string) => {
  //   const openCFDDetails: IOpenCFDDetails = await Promise.resolve(dummyOpenCFDDetails);
  //   return openCFDDetails;
  // };
  const getOpendCFD = (id: string) => dummyOpenCFDDetails;

  // const getClosedCFD = async (props: string) => {
  //   const closedCFDDetails: IClosedCFDDetails = await Promise.resolve(dummyCloseCFDDetails);
  //   return closedCFDDetails;
  // };
  const getClosedCFD = (id: string) => dummyCloseCFDDetails;

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
    getOpendCFD,
    listClosedCFDBriefs,
    getClosedCFD,
    connect,
    signServiceTerm,
    disconnect,
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
