/* eslint-disable no-console */
import React, {useState, createContext} from 'react';
import {ICardProps, ILineGraphProps} from '../../components/card/crypto_card';
import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';
import {
  dummyOpenCFDBriefs,
  IOpenCFDBrief,
} from '../../interfaces/tidebit_defi_background/open_cfd_brief';
import {
  IOpenCFDDetails,
  dummyOpenCFDDetails,
} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  dummyClosedCFDBriefs,
  IClosedCFDBrief,
} from '../../interfaces/tidebit_defi_background/closed_cfd_brief';
import {
  IClosedCFDDetails,
  dummyCloseCFDDetails,
} from '../../interfaces/tidebit_defi_background/closed_cfd_details';

export interface ITickerData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  // starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: number;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ILineGraphProps;
}

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

const SAMPLE_USER = {
  id: '002',
  username: 'Tidebit DeFi Test User',
  wallet: ['0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30'],
  favoriteTickers: [],
  balance: {
    available: 1296.47,
    locked: 583.62,
    PNL: 1956.84,
  },
  walletBalance: 894,
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
  wallet: string[];
  walletBalance: number | null;
  balance: IUserBalance | null;
  favoriteTickers: string[];
  addFavorites: (props: string) => void;
  removeFavorites: (props: string) => void;
  listOpenedCFDs: () => IOpenCFDBrief[];
  listClosedCFDs: () => IClosedCFDBrief[];
  getOpenedCFD: (props: string) => Promise<IOpenCFDDetails>;
  getClosedCFD: (props: string) => Promise<IClosedCFDDetails>;
}

export const UserContext = createContext<IUserContext>({
  id: null,
  username: null,
  wallet: [],
  walletBalance: null,
  balance: null,
  favoriteTickers: [],
  addFavorites: (props: string) => null,
  removeFavorites: (props: string) => null,
  listOpenedCFDs: () => dummyOpenCFDBriefs,
  listClosedCFDs: () => dummyClosedCFDBriefs,
  getOpenedCFD: (props: string) => Promise.resolve<IOpenCFDDetails>(dummyOpenCFDDetails),
  getClosedCFD: (props: string) => Promise.resolve<IClosedCFDDetails>(dummyCloseCFDDetails),
});

export const UserProvider = ({children}: IUserProvider) => {
  // TODO: get partial user type from `IUserContext`
  const [id, setId] = useState<string | null>('002');
  const [username, setUsername] = useState<string | null>('Tidebit DeFi Test User');
  const [wallet, setWallet] = useState<string[]>(['0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30']);
  const [walletBalance, setWalletBalance] = useState<number | null>(894);
  const [balance, setBalance] = useState<IUserBalance | null>(null);
  const [favoriteTickers, setFavoriteTickers] = useState<string[]>([]);

  const addFavorites = (newFavorite: string) => {
    if (id) {
      const updatedFavoriteTickers = [...favoriteTickers];
      updatedFavoriteTickers.push(newFavorite);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
    }
  };

  const removeFavorites = (previousFavorite: string) => {
    if (id) {
      const updatedFavoriteTickers = [...favoriteTickers];
      const index: number = updatedFavoriteTickers.findIndex(
        currency => currency === previousFavorite
      );
      if (index !== -1) updatedFavoriteTickers.splice(index, 1);
      setFavoriteTickers(updatedFavoriteTickers);
      console.log(`updatedFavoriteTickers`, updatedFavoriteTickers);
    }
  };

  const listOpenedCFDs = () => dummyOpenCFDBriefs;

  const listClosedCFDs = () => dummyClosedCFDBriefs;

  const getOpenedCFD = async (props: string) => {
    const openCFDDetails: IOpenCFDDetails = await Promise.resolve(dummyOpenCFDDetails);
    return openCFDDetails;
  };

  const getClosedCFD = async (props: string) => {
    const closedCFDDetails: IClosedCFDDetails = await Promise.resolve(dummyCloseCFDDetails);
    return closedCFDDetails;
  };

  const defaultValue = {
    id,
    username,
    wallet,
    walletBalance,
    balance,
    favoriteTickers,
    addFavorites,
    removeFavorites,
    listOpenedCFDs,
    getOpenedCFD,
    listClosedCFDs,
    getClosedCFD,
  };

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
