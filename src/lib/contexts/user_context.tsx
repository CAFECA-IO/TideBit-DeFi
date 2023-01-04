import React, {useContext, useState, useEffect, createContext} from 'react';

interface IUser {
  name: string;
  // tidebitAccount: string;
  // email: string;
  // address: string[];
  // avatar: string;
  favoriteList: string[];
  // availableBalance: number;
  // lockedBalance: number;
  // profitOrLoss: {timeSpan: string; amount: number; profitOrLoss: string}[];
  // signature: {type:string; data: string}[];
  // signServiceTerms: boolean;
  // positionList: {status: string; ticker: string; amount: number; price: number}[];
}

interface IUserProvider {
  children: React.ReactNode;
}

interface IUserContext {
  user: IUser[] | null;
  setUser: (user: IUser[] | null) => void;
}

export const UserContext = createContext<IUserContext | null>({
  user: null,
  setUser: (user: IUser[] | null) => null,
});

export const UserProvider = ({children}: IUserProvider) => {
  const [user, setUser] = useState<IUser[] | null>([]);
  // const [user, setUser] = useState<IUserContext>(null);
  const defaultValue = {user, setUser};
  // useEffect(() => {
  //   const user = localStorage.getItem('user');
  //   setUser(user);
  // }, []);

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
