import {Trend} from '../../constants/trend';
import {IFluctuating} from './fluctuating';
import {getDummyTicker, ITickerData} from './ticker_data';

export interface IPriceStatistics {
  fiveMin: {low: number; high: number; now: string}; // now = [(now - low) / (high - low)] x 100
  sixtyMin: {low: number; high: number; now: string};
  oneDay: {low: number; high: number; now: string};
}

export interface ITickerLiveStatistics {
  id: string;

  spread: number; // 點差 %
  fee: number; // 手續費

  longRecommendedTp: number; // the same as shortRecommendedSl
  longRecommendedSl: number; // the same as shortRecommendedTp

  volume: number; // 24 hr volume
  price: number;
  fluctuating: IFluctuating;
  buyEstimatedFilledPrice: number; // price + spread = estimated filled price
  sellEstimatedFilledPrice: number; // price - spread = estimated filled price

  bullAndBearIndex: number; // BBI 多空指數
  priceStatistics: IPriceStatistics; // [5m, 60m, 1d]
}

export const dummyTickerLiveStatistics: ITickerLiveStatistics = {
  id: 'ETH',
  longRecommendedSl: 5346.85,
  longRecommendedTp: 7233.97,
  spread: 0.1,
  fee: 0,
  volume: 92154731,
  price: 1580,
  fluctuating: {type: Trend.UP, value: 23.3, percentage: 2.65},
  buyEstimatedFilledPrice: 1590,
  sellEstimatedFilledPrice: 1570,
  bullAndBearIndex: 39,
  priceStatistics: {
    fiveMin: {low: 1200, high: 1320, now: '82'},
    sixtyMin: {low: 1100, high: 1840, now: '27'},
    oneDay: {low: 1060, high: 2040, now: '39'},
  },
};

export const getDummyTickerLiveStatistics = (currency: string) => {
  const ticker: ITickerData = getDummyTicker(currency);
  const longRecommendedSl = parseFloat((Math.random() * 10000).toFixed(2));
  const longRecommendedTp = longRecommendedSl + parseFloat((Math.random() * 1000).toFixed(2));
  const tickerLiveStatistics: ITickerLiveStatistics = {
    id: currency,
    longRecommendedSl,
    longRecommendedTp,
    spread: 0.1,
    fee: 0,
    volume: 92154731,
    price: ticker.price,
    fluctuating: {type: ticker.upOrDown, value: ticker.priceChange, percentage: ticker.fluctuating},
    buyEstimatedFilledPrice: parseFloat((ticker.price * 1.05).toFixed(2)),
    sellEstimatedFilledPrice: parseFloat((ticker.price * 0.95).toFixed(2)),
    bullAndBearIndex: parseInt((Math.random() * 100).toFixed(0)),
    priceStatistics: {
      fiveMin: {
        low: parseFloat((ticker.price * 0.95).toFixed(2)),
        high: parseFloat((ticker.price * 1.15).toFixed(2)),
        now: '82',
      },
      sixtyMin: {
        low: parseFloat((ticker.price * 0.85).toFixed(2)),
        high: parseFloat((ticker.price * 1.2).toFixed(2)),
        now: '27',
      },
      oneDay: {
        low: parseFloat((ticker.price * 0.75).toFixed(2)),
        high: parseFloat((ticker.price * 1.3).toFixed(2)),
        now: '39',
      },
    },
  };
  return tickerLiveStatistics;
};
