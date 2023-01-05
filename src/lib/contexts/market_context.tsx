import React, {useState, createContext} from 'react';

export interface ITickerData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: number;
  gradientColor: string;
  tokenImg: string;
}

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

const TRADING_CRYPTO_DATA: ITickerData[] = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    starColor: 'text-bluePurple',
    // getStarredStateCallback: getEthStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
    tokenImg: '/elements/group_2371.svg',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: false,
    starColor: 'text-lightOrange',
    // getStarredStateCallback: getBtcStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
    tokenImg: '/elements/group_2372.svg',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    starColor: 'text-lightGray2',
    // getStarredStateCallback: getLtcStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
    starColor: 'text-lightPurple',
    // getStarredStateCallback: getMaticStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightPurple/60 bg-black from-lightPurple/60 to-black',
    tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    starColor: 'text-lightYellow',
    // getStarredStateCallback: getBnbStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightYellow/60 bg-black from-lightYellow/50 to-black',
    tokenImg: '/elements/group_2374.svg',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    starColor: 'text-lightPurple2',
    // getStarredStateCallback: getSolStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightPurple2/60 from-lightPurple2/60 to-black',
    tokenImg: '/elements/group_2378.svg',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    starColor: 'text-lightRed1',
    // getStarredStateCallback: getShibStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
    tokenImg: '/elements/group_2381.svg',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    starColor: 'text-lightPink',
    // getStarredStateCallback: getDotStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightPink/60 from-lightPink/60 to-black',
    tokenImg: '/elements/group_2385.svg',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    starColor: 'text-lightGreen1',
    // getStarredStateCallback: getAdaStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightGreen1/60 from-lightGreen1/60 to-black',
    tokenImg: '/elements/group_2388.svg',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: false,
    starColor: 'text-lightRed2',
    // getStarredStateCallback: getAvaxStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
    tokenImg: '/elements/group_2391.svg',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    starColor: 'text-lightOrange1',
    // getStarredStateCallback: getDaiStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
    tokenImg: '/elements/layer_x0020_1.svg',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
    starColor: 'text-lightGreen3',
    // getStarredStateCallback: getMkrStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
    tokenImg: '/elements/layer_2.svg',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    starColor: 'text-lightGray4',
    // getStarredStateCallback: getXrpStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
    tokenImg: '/elements/group_2406.svg',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    starColor: 'text-lightYellow1',
    // getStarredStateCallback: getDogeStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
    tokenImg: '/elements/layer_2-1.svg',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    starColor: 'text-lightPink1',
    // getStarredStateCallback: getUniStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
    tokenImg: '/elements/uniswap-uni-logo.svg',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    starColor: 'text-lightGreen4',
    // getStarredStateCallback: getFlowStarred,
    price: 1288.4,
    fluctuating: 1.14,
    gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
    tokenImg: '/elements/layer_2_1_.svg',
  },
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
