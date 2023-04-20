import {TRADING_CRYPTO_DATA, unitAsset} from '../../constants/config';
import {ICurrency} from '../../constants/currency';
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

export const strokeColorDisplayed = (sampleArray: number[]) => {
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

export interface ITicker {
  currency: ICurrency;
  chain: string;
}

export interface ITickerProperty extends ITicker {
  star: boolean;
  starred: boolean;
  tokenImg: string;
}

export interface ITickerMarket extends ITicker {
  price: number;
  upOrDown: ITrend;
  priceChange: number;
  fluctuating: number;
  tradingVolume: string;
}

export interface ITickerItem extends ITickerProperty, ITickerMarket {}

export interface ITickerData extends ITickerItem {
  lineGraphProps: ILineGraphProps;
}

// Add line graph property to each object in array
export const dummyTickers: ITickerData[] = TRADING_CRYPTO_DATA.map(data => {
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const price = parseFloat((Math.random() * 1000).toFixed(2));
  const priceChange = parseFloat((Math.random() * 100).toFixed(2));
  const fluctuating = parseFloat((priceChange / (price + priceChange)).toFixed(2));
  const tradingVolume = (Math.random() * 1000).toFixed(2);
  const upOrDown =
    Math.random() >= 0.5 ? (Math.random() === 0.5 ? Trend.EQUAL : Trend.UP) : Trend.DOWN;
  const ticker: ITickerData = {
    ...data,
    price,
    priceChange,
    fluctuating,
    upOrDown,
    tradingVolume,
    lineGraphProps: {
      dataArray: dataArray,
      strokeColor: strokeColor,
      lineGraphWidth: '170',
      lineGraphWidthMobile: '140',
    },
  };
  return ticker;
});

export const toDummyTickers: {[currency in ICurrency]: ITickerData} = dummyTickers.reduce(
  (acc, ticker) => {
    acc[ticker.currency] = ticker;
    return acc;
  },
  {} as {[currency in ICurrency]: ITickerData}
);

export const dummyTicker: ITickerData = dummyTickers[0];

export const getDummyTicker = (currency: ICurrency) => {
  const data =
    TRADING_CRYPTO_DATA.find(ticker => ticker.currency === currency) || TRADING_CRYPTO_DATA[0];
  const dataArray = randomArray(1100, 1200, 10);
  const strokeColor = strokeColorDisplayed(dataArray);
  const price = parseFloat((Math.random() * 1000).toFixed(2));
  const priceChange = parseFloat((Math.random() * 100).toFixed(2));
  const fluctuating = parseFloat((priceChange / (price + priceChange)).toFixed(2));
  const upOrDown =
    Math.random() >= 0.5 ? (Math.random() === 0.5 ? Trend.EQUAL : Trend.UP) : Trend.DOWN;
  const tradingVolume = (Math.random() * 1000).toFixed(2);
  const dummyTicker: ITickerData = {
    ...data,
    price,
    priceChange,
    fluctuating,
    upOrDown,
    tradingVolume,
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

export interface ISortedTrade {
  [second: string]: {
    second: number;
    trades: {open: ITBETrade; high: ITBETrade; low: ITBETrade; close: ITBETrade};
    datas: ITBETrade[];
  };
}

export const convertToTickerMartket = (tickerProperty: ITickerProperty, marketData: ITBETicker) => {
  const ticker: ITickerMarket = {
    currency: tickerProperty.currency,
    chain: tickerProperty.chain,
    tradingVolume: marketData.volume,
    price: parseFloat(marketData.last),
    upOrDown:
      +marketData.changePct === 0
        ? Trend.EQUAL
        : marketData.changePct.includes('-')
        ? Trend.DOWN
        : Trend.UP,
    priceChange: parseFloat(marketData.change),
    fluctuating: parseFloat((parseFloat(marketData.changePct) * 100).toFixed(2)),
  };

  return ticker;
};

export const convertToTickerMartketData = (marketData: ITBETicker) => {
  let ticker: ITickerMarket | null = null;
  if (marketData.quoteUnit.toUpperCase() === unitAsset) {
    const tickerData: ITickerProperty | undefined = TRADING_CRYPTO_DATA.find(
      ticker => ticker.currency === marketData.baseUnit.toUpperCase()
    );
    if (tickerData) {
      ticker = convertToTickerMartket(tickerData, marketData);
    }
  }
  return ticker;
};
