import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';
import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';

export interface ITickerStatic {
  id: string;
  label: string; // 交易對名稱
  leverage: number;

  guranteedStopFee: number; // 保證停損手續費
  longRecommendedTp: number; // the same as shortRecommendedSl
  longRecommendedSl: number; // the same as shortRecommendedTp

  // slippage: number; // 滑價
  cryptoBriefNews: IBriefNewsItem[]; // 相關新聞
  // getCryptoNews: () => IBriefNewsItem[];
  cryptoSummary: ICryptoSummary; // 相關資訊
  // getCryptoSummary: () => ICryptoSummary;
}
