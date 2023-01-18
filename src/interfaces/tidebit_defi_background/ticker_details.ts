import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';
import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';

export interface ITickerDetails {
  label: string;
  price: number;
  fluctuating: IFluctuating;
  volume: number; // 24 hr volume

  leverage: number;

  spread: number; // 點差 %
  fee: number; // 手續費
  guranteedStopFee: number; // 保證停損手續費
  // slippage: number; // 滑價
  buyEstimatedFilledPrice: number; // price + spread = estimated filled price
  sellEstimatedFilledPrice: number; // price - spread = estimated filled price

  bullAndBearIndex: number; // BBI 多空指數
  priceData: IPriceStatistics; // [5m, 60m, 1d]
  cryptoSummary: ICryptoSummary;
  cryptoNews: IBriefNewsItem[];

  // cryptoDetails: ICryptoDetails;
  // news: (props: string) => IBriefNewsItem[];
}
