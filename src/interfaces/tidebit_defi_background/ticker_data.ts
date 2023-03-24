import {TRADING_CRYPTO_DATA, unitAsset} from '../../constants/config';
import {TypeOfPnLColorHex} from '../../constants/display';
import {ITrend, Trend} from '../../constants/trend';

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

export interface ITickerMarket {
  currency: string;
  chain: string;
  price: number;
  upOrDown: ITrend;
  priceChange: number;
  fluctuating: number;
  tradingVolume: string;
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

interface ITBEFee {
  fee: number;
  heroFee: number;
  vipFee: number;
  currency: string;
  fixed: number;
}
export interface ITBETicker {
  id: string;
  instId: string;
  ask: ITBEFee;
  bid: ITBEFee;
  at: number;
  baseUnit: string;
  quoteUnit: string;
  tickSz: string;
  lotSz: string;
  minSz: string;
  buy: string; // buy price
  sell: string; // sell price
  high: string; // high price
  low: string; // low price
  open: string; // open price
  close: string; // close price
  last: string; // last price
  volume: string;
  change: string;
  changePct: string;
  code: number;
  visible: boolean;
}

export interface ITBETrade {
  id: string;
  tid: string;
  market: string;
  price: string;
  amount: string;
  volume: string;
  type: string;
  side: string;
  at: number;
  ts: string;
  date: string;
}

export const convertToTickerMartketData = (data: ITBETicker) => {
  let ticker: ITickerMarket | null = null;
  if (data.quoteUnit.toUpperCase() === unitAsset) {
    const tickerData = TRADING_CRYPTO_DATA.find(
      ticker => ticker.currency === data.baseUnit.toUpperCase()
    );
    if (tickerData) {
      ticker = {
        currency: tickerData.currency,
        chain: tickerData.chain,
        tradingVolume: data.volume,
        price: parseFloat(data.last),
        upOrDown:
          +data.changePct === 0
            ? Trend.EQUAL
            : data.changePct.includes('-')
            ? Trend.DOWN
            : Trend.UP,
        priceChange: parseFloat(data.change),
        fluctuating: parseFloat((parseFloat(data.changePct) * 100).toFixed(2)),
      };
    }
  }
  return ticker;
};
