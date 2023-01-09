import React, {useState, createContext} from 'react';
import {ICardProps, ILineGraphProps} from '../../components/card/crypto_card';
import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';

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

const TRADING_CRYPTO_DATA = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2371.svg',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2372.svg',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2374.svg',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2378.svg',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2381.svg',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2385.svg',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2388.svg',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2391.svg',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_x0020_1.svg',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: true,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2.svg',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2406.svg',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2-1.svg',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/uniswap-uni-logo.svg',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_2_1_.svg',
  },
];

// const TRADING_CRYPTO_DATA = [
//   {
//     currency: 'ETH',
//     chain: 'Ethereum',
//     star: true,
//     starred: false,
//     starColor: 'text-bluePurple',
//     // getStarredStateCallback: getEthStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-bluePurple/50 bg-black from-bluePurple/50 to-black',
//     tokenImg: '/elements/group_2371.svg',
//   },
//   {
//     currency: 'BTC',
//     chain: 'Bitcoin',
//     star: true,
//     starred: false,
//     starColor: 'text-lightOrange',
//     // getStarredStateCallback: getBtcStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightOrange/50 bg-black from-lightOrange/50 to-black',
//     tokenImg: '/elements/group_2372.svg',
//   },
//   {
//     currency: 'LTC',
//     chain: 'Litecoin',
//     star: true,
//     starred: true,
//     starColor: 'text-lightGray2',
//     // getStarredStateCallback: getLtcStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightGray2/50 bg-black from-lightGray2/50 to-black',
//     tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
//   },
//   {
//     currency: 'MATIC',
//     chain: 'Polygon',
//     star: true,
//     starred: true,
//     starColor: 'text-lightPurple',
//     // getStarredStateCallback: getMaticStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightPurple/50 bg-black from-lightPurple/50 to-black',
//     tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
//   },
//   {
//     currency: 'BNB',
//     chain: 'BNB',
//     star: true,
//     starred: false,
//     starColor: 'text-lightYellow',
//     // getStarredStateCallback: getBnbStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightYellow/50 bg-black from-lightYellow/50 to-black',
//     tokenImg: '/elements/group_2374.svg',
//   },
//   {
//     currency: 'SOL',
//     chain: 'Solana',
//     star: true,
//     starred: true,
//     starColor: 'text-lightPurple2',
//     // getStarredStateCallback: getSolStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightPurple2/50 from-lightPurple2/50 to-black',
//     tokenImg: '/elements/group_2378.svg',
//   },
//   {
//     currency: 'SHIB',
//     chain: 'Shiba Inu',
//     star: true,
//     starred: false,
//     starColor: 'text-lightRed1',
//     // getStarredStateCallback: getShibStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightRed1/50 from-lightRed1/50 to-black',
//     tokenImg: '/elements/group_2381.svg',
//   },
//   {
//     currency: 'DOT',
//     chain: 'Polkadot',
//     star: true,
//     starred: true,
//     starColor: 'text-lightPink',
//     // getStarredStateCallback: getDotStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightPink/50 from-lightPink/50 to-black',
//     tokenImg: '/elements/group_2385.svg',
//   },
//   {
//     currency: 'ADA',
//     chain: 'Cardano',
//     star: true,
//     starred: false,
//     starColor: 'text-lightGreen1',
//     // getStarredStateCallback: getAdaStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightGreen1/50 from-lightGreen1/50 to-black',
//     tokenImg: '/elements/group_2388.svg',
//   },
//   {
//     currency: 'AVAX',
//     chain: 'Avalanche',
//     star: true,
//     starred: false,
//     starColor: 'text-lightRed2',
//     // getStarredStateCallback: getAvaxStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightRed2/50 from-lightRed2/50 to-black',
//     tokenImg: '/elements/group_2391.svg',
//   },
//   {
//     currency: 'Dai',
//     chain: 'Dai',
//     star: true,
//     starred: false,
//     starColor: 'text-lightOrange1',
//     // getStarredStateCallback: getDaiStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightOrange1/50 from-lightOrange1/50 to-black',
//     tokenImg: '/elements/layer_x0020_1.svg',
//   },
//   {
//     currency: 'MKR',
//     chain: 'Maker',
//     star: true,
//     starred: false,
//     starColor: 'text-lightGreen3',
//     // getStarredStateCallback: getMkrStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightGreen3/50 from-lightGreen3/50 to-black',
//     tokenImg: '/elements/layer_2.svg',
//   },
//   {
//     currency: 'XRP',
//     chain: 'XRP',
//     star: true,
//     starred: false,
//     starColor: 'text-lightGray4',
//     // getStarredStateCallback: getXrpStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightGray4/50 from-lightGray4/50 to-black',
//     tokenImg: '/elements/group_2406.svg',
//   },
//   {
//     currency: 'DOGE',
//     chain: 'Dogecoin',
//     star: true,
//     starred: false,
//     starColor: 'text-lightYellow1',
//     // getStarredStateCallback: getDogeStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightYellow1/50 from-lightYellow1/50 to-black',
//     tokenImg: '/elements/layer_2-1.svg',
//   },
//   {
//     currency: 'UNI',
//     chain: 'Uniswap',
//     star: true,
//     starred: false,
//     starColor: 'text-lightPink1',
//     // getStarredStateCallback: getUniStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightPink1/50 from-lightPink1/50 to-black',
//     tokenImg: '/elements/uniswap-uni-logo.svg',
//   },
//   {
//     currency: 'Flow',
//     chain: 'Flow',
//     star: true,
//     starred: false,
//     starColor: 'text-lightGreen4',
//     // getStarredStateCallback: getFlowStarred,
//     price: 1288.4,
//     fluctuating: 1.14,
//     gradientColor: 'border-lightGreen4/50 from-lightGreen4/50 to-black',
//     tokenImg: '/elements/layer_2_1_.svg',
//   },
// ];

// Add line graph property to each object in array
const addPropertyToArray: ITickerData[] = TRADING_CRYPTO_DATA.map(item => {
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const newArray = {
    ...item,
    lineGraphProps: {
      dataArray: dataArray,
      strokeColor: strokeColor,
      lineGraphWidth: '170',
      lineGraphWidthMobile: '140',
    },
  };
  // console.log('starColor:', item.starColor, 'gradientColor:', item.gradientColor);

  return newArray;
});

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  availableTickers: ITickerData[];
  isCFDTradable: boolean;
  showPositionOnChart: boolean;
  setShowPositionOnChart: (value: boolean) => void;
  // getTickerData: (ticker: string) => ITickerData; // 會拿到哪些是被star的
}

// TODO: Note: _app.tsx 啟動的時候 => createContext
export const MarketContext = createContext<IMarketContext>({
  availableTickers: [],
  isCFDTradable: false,
  showPositionOnChart: false,
  setShowPositionOnChart: () => null,
  // getTickerData: () => ITickerData,
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [availableTickers, setAvailableTickers] = useState<ITickerData[]>(addPropertyToArray);
  const [isCFDTradable, setIsCFDTradable] = useState<boolean>(true);
  const [showPositionOnChart, setShowPositionOnChart] = useState<boolean>(false);

  // console.log('Whole array [addPropertyToArray]:', addPropertyToArray);
  // setAvailableTickers(addPropertyToArray); // infinite loop

  const defaultValue = {
    availableTickers,
    isCFDTradable,
    showPositionOnChart,
    setShowPositionOnChart,
  };
  return <MarketContext.Provider value={defaultValue}>{children}</MarketContext.Provider>;
};
