import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';
import {IFluctuating} from './fluctuating';
import {IPriceStatistics} from './price_statistics';

export interface ITickerStatic {
  id: string;
  label: string; // 交易對名稱
  leverage: number;

  guaranteedStopFee: number; // 保證停損手續費

  // slippage: number; // 滑價
  cryptoBriefNews: IBriefNewsItem[]; // 相關新聞
  // getCryptoNews: () => IBriefNewsItem[];
  cryptoSummary: ICryptoSummary; // 相關資訊
  // getCryptoSummary: () => ICryptoSummary;
}
