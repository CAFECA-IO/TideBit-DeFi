import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';

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
