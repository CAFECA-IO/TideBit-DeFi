import {TypeOfPnLColorHex} from '../../constants/display';
import {ITrend, Trend} from '../../constants/trend';

const TRADING_CRYPTO_DATA = [
  {
    currency: 'ETH',
    chain: 'Ethereum',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2371.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BTC',
    chain: 'Bitcoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2372.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/9cc18b0cbe765b0a28791d253207f0c0.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'BNB',
    chain: 'BNB',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2374.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SOL',
    chain: 'Solana',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2378.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'SHIB',
    chain: 'Shiba Inu',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2381.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOT',
    chain: 'Polkadot',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2385.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'ADA',
    chain: 'Cardano',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2388.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'AVAX',
    chain: 'Avalanche',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2391.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_x0020_1.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'XRP',
    chain: 'XRP',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/group_2406.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'DOGE',
    chain: 'Dogecoin',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2-1.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'UNI',
    chain: 'Uniswap',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/uniswap-uni-logo.svg',
    tradingVolume: '217,268,645',
  },
  {
    currency: 'Flow',
    chain: 'Flow',
    star: true,
    starred: false,
    // price: 1288.4,
    // fluctuating: 1.14,
    tokenImg: '/elements/layer_2_1_.svg',
    tradingVolume: '217,268,645',
  },
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

const strokeColorDisplayed = (sampleArray: number[]) => {
  if (sampleArray[sampleArray.length - 1] > sampleArray[sampleArray.length - 2]) {
    // priceColor = 'text-lightGreen';
    return [TypeOfPnLColorHex.PROFIT];
  }

  // priceColor = 'text-lightRed';
  return [TypeOfPnLColorHex.LOSS];
};

export interface ILineGraphProps {
  dataArray?: number[];
  strokeColor?: string[];
  lineGraphWidth?: string;
  lineGraphWidthMobile?: string;
}
export interface ITickerData {
  currency: string;
  chain: string;
  star: boolean;
  starred: boolean;
  // starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  upOrDown: ITrend;
  priceChange: number;
  fluctuating: number;
  tradingVolume: string;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ILineGraphProps;
}

// Add line graph property to each object in array
export const dummyTickers: ITickerData[] = TRADING_CRYPTO_DATA.map(data => {
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const price = parseFloat((Math.random() * 1000).toFixed(2));
  const priceChange = parseFloat((Math.random() * 100).toFixed(2));
  const fluctuating = parseFloat((priceChange / (price + priceChange)).toFixed(2));
  const upOrDown =
    Math.random() >= 0.5 ? (Math.random() === 0.5 ? Trend.EQUAL : Trend.UP) : Trend.DOWN;
  const ticker: ITickerData = {
    ...data,
    price,
    priceChange,
    fluctuating,
    upOrDown,
    lineGraphProps: {
      dataArray: dataArray,
      strokeColor: strokeColor,
      lineGraphWidth: '170',
      lineGraphWidthMobile: '140',
    },
  };
  return ticker;
});

export const dummyTicker: ITickerData = dummyTickers[0];

export const getDummyTicker = (currency: string) => {
  const data =
    TRADING_CRYPTO_DATA.find(ticker => ticker.currency === currency) || TRADING_CRYPTO_DATA[0];
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const price = parseFloat((Math.random() * 1000).toFixed(2));
  const priceChange = parseFloat((Math.random() * 100).toFixed(2));
  const fluctuating = parseFloat((priceChange / (price + priceChange)).toFixed(2));
  const upOrDown =
    Math.random() >= 0.5 ? (Math.random() === 0.5 ? Trend.EQUAL : Trend.UP) : Trend.DOWN;
  const dummyTicker: ITickerData = {
    ...data,
    price,
    priceChange,
    fluctuating,
    upOrDown,
    lineGraphProps: {
      dataArray: dataArray,
      strokeColor: strokeColor,
      lineGraphWidth: '170',
      lineGraphWidthMobile: '140',
    },
  };
  return dummyTicker;
};
