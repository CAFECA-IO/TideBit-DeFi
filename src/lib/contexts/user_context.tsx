import React, {useContext, useState, useEffect, createContext} from 'react';

const SAMPLE_USER = {
  id: '002',
  username: 'Tidebit DeFi Test User',
  address: ['0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30'],
  favoriteTickers: ['MKR', 'XRP'],
};

export interface IUser {
  id: string;
  username: string;
  // tidebitAccount: string;
  // email: string;
  address: string[];
  // avatar: string;
  favoriteTickers: string[];
  // availableBalance: number;
  // lockedBalance: number;
  // profitOrLoss: {timeSpan: string; amount: number; profitOrLoss: string}[];
  // signature: {type:string; data: string}[];
  // signServiceTerms: boolean;
  // positionList: {status: string; ticker: string; amount: number; price: number}[];
}

export interface IUserProvider {
  children: React.ReactNode;
}

export interface IUserContext {
  user: IUser[] | null;
  setUser: (user: IUser[] | null) => void;
}

export const UserContext = createContext<IUserContext | null>({
  user: null,
  setUser: (user: IUser[] | null) => null,
});

export const UserProvider = ({children}: IUserProvider) => {
  const [user, setUser] = useState<IUser[] | null>([SAMPLE_USER]);
  // const [user, setUser] = useState<IUserContext>(null);
  const defaultValue = {user, setUser};
  // useEffect(() => {
  //   const user = localStorage.getItem('user');
  //   setUser(user);
  // }, []);

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
