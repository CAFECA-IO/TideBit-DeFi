import React, {useState, createContext} from 'react';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  availableTickers: string[] | null;
}

export const MarketContext = createContext<IMarketContext>({
  availableTickers: null,
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [availableTickers, setAvailableTickers] = useState<string[] | null>(['BTC', 'ETH', 'MKR']);
  const defaultValue = {availableTickers};

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
