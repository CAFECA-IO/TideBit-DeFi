import React, {useContext, useState, useEffect, createContext} from 'react';

interface IMarketProvider {
  children: React.ReactNode;
}

interface IMarketContext {
  availableTickers: string[] | null;
}

export const MarketContext = createContext<IMarketContext | null>({
  availableTickers: null,
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [availableTickers, setAvailableTickers] = useState<string[]>([]);
  const defaultValue = {availableTickers};

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
