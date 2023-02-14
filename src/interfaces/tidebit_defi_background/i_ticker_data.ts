import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';

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
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2372.svg',
  },
  {
    currency: 'LTC',
    chain: 'Litecoin',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg',
  },
  {
    currency: 'MATIC',
    chain: 'Polygon',
    star: true,
    starred: false,
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
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/group_2391.svg',
  },
  {
    currency: 'Dai',
    chain: 'Dai',
    star: true,
    starred: false,
    price: 1288.4,
    fluctuating: 1.14,
    tokenImg: '/elements/layer_x0020_1.svg',
  },
  {
    currency: 'MKR',
    chain: 'Maker',
    star: true,
    starred: false,
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
    return [PROFIT_LOSS_COLOR_TYPE.profit];
  }

  // priceColor = 'text-lightRed';
  return [PROFIT_LOSS_COLOR_TYPE.loss];
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
  fluctuating: number;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ILineGraphProps;
}

// Add line graph property to each object in array
export const dummyTickers: ITickerData[] = TRADING_CRYPTO_DATA.map(data => {
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const ticker: ITickerData = {
    ...data,
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
  const dummyTicker: ITickerData =
    dummyTickers.find(ticker => ticker.currency === currency) || dummyTickers[0];
  return dummyTicker;
};
