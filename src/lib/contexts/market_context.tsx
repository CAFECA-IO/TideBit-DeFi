import React, {useState, createContext} from 'react';

const SAMPLE_TICKERS = [
  'ETH',
  'BTC',
  'LTC',
  'MATIC',
  'BNB',
  'SOL',
  'SHIB',
  'DOT',
  'ADA',
  'AVAX',
  'Dai',
  'MKR',
  'XRP',
  'DOGE',
  'UNI',
  'Flow',
];

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
  const [availableTickers, setAvailableTickers] = useState<string[] | null>(SAMPLE_TICKERS);
  const defaultValue = {availableTickers};

  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
