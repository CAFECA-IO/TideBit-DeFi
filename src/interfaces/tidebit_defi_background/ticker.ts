import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';
import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';

export interface ITicker {
  id: string;
  label: string; // 交易對名稱
  leverage: number;
  spread: number; // 點差 %
  fee: number; // 手續費
  guranteedStopFee: number; // 保證停損手續費
  // slippage: number; // 滑價
  getCryptoNews: () => IBriefNewsItem[];
  getCryptoSummary: () => ICryptoSummary;
}
