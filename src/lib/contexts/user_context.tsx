import React, {useContext, useState, useEffect, createContext} from 'react';

const SAMPLE_USER = {
  id: '002',
  username: 'Tidebit DeFi Test User',
  address: ['0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30'],
  favoriteTickers: null,
};

export interface IUser {
  id: string;
  username: string;
  // tidebitAccount: string;
  // email: string;
  address: string[];
  // avatar: string;
  favoriteTickers: string[] | null;

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
  favoriteTickersHandler: (newFavorite: string) => void;
}

export const UserContext = createContext<IUserContext | null>({
  user: null,
  setUser: (user: IUser[] | null) => null,
  favoriteTickersHandler: (newFavorite: string) => null,
});

export const UserProvider = ({children}: IUserProvider) => {
  const [user, setUser] = useState<IUser[] | null>([SAMPLE_USER]);

  const favoriteTickersHandler = (newFavorite: string) => {
    if (!user) return;

    // ticker handler
    if (user[0]?.favoriteTickers?.includes(newFavorite)) {
      // console.log('included, ready to remove: ', newFavorite);

      // setUser(previousData => {
      //   if (!previousData) return;
      //   const updated = [...previousData];
      //   updated[0].favoriteTickers = [...previousData[0].favoriteTickers, newFavorite];
      // });
      const newUserArray = [
        {
          ...user[0],
          favoriteTickers: user[0].favoriteTickers.filter(ticker => ticker !== newFavorite),
        },
      ];
      // console.log('new user array: ', newUserArray);
      setUser(newUserArray);
      // console.log('REAL user array in context: ', user);

      // setUser([
      //   {
      //     ...user[0],
      //     favoriteTickers: user[0].favoriteTickers.filter(ticker => ticker !== newFavorite),
      //   },
      // ]);
      // addFavorite(newFavorite);
    } else {
      // console.log('not included, ready to add: ', newFavorite);
      // <Toast content={`not included, ready to add:  ${newFavorite}`} />;

      if (!user[0].favoriteTickers) {
        const newUserArray = [{...user[0], favoriteTickers: [newFavorite]}];
        // console.log('new user array: ', newUserArray);
        setUser(newUserArray);
        // console.log('REAL user array in context: ', user);
      } else {
        const newUserArray = [
          {...user[0], favoriteTickers: [...user[0].favoriteTickers, newFavorite]},
        ];

        // console.log('new user array: ', newUserArray);
        setUser(newUserArray);
        // console.log('REAL user array in context: ', user);
      }

      // removeFavorite(newFavorite);
    }

    // console.log('receive favoriteTickers: ', newFavorite);
    // console.log('user favorite in context: ', user[0].favoriteTickers);
  };

  const defaultValue = {user, setUser, favoriteTickersHandler};

  // FIXME: 'setUser' is missing in type '{ user: IUser[] | null; }'
  return <UserContext.Provider value={defaultValue}>{children}</UserContext.Provider>;
};
