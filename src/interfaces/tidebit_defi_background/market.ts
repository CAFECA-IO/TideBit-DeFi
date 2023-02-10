import {ICandlestick} from './candlestick';
import {IReserve} from './reserve';
import {ITickerStatic} from './ticker_static';
import {ITickerItem} from './ticker_item';
import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITideBitPromotion} from './tidebit_promotion';
import {ITimeSpanUnion} from './time_span_union';
import {ICryptocurrency} from './cryptocurrency';
import {ITicker} from './ticker';
import {IBriefNewsItem} from './brief_news_item';
import {ICryptoSummary} from './crypto_summary';

export interface IMarket {
  switchTicker: (tickerId: string) => ITicker; // 切換交易對

  tickers: ITickerItem[]; // availableTickers: ITickerItem[];
  // getTickers: (tickerId: string) => ITickerItem[]; // 拿到交易對清單

  isCFDTradable: boolean;
  // getIsCFDTradable: (tickerId: string) => boolean;

  ticker: ITickerStatic;
  // getTicker: (tickerId: string) => ITickerStatic;

  getCryptoNews: (tickerId: string) => IBriefNewsItem[];
  getCryptoSummary: (tickerId: string) => ICryptoSummary;

  /**
   * + getTickerWithDetails(tickerId)
   * + getCryptocurrencies
   * + getTickerDetails(tickerId)
   * + getCryptocurrencyDetails(cryptocurrencyId)
   */
  tickerLiveStatistics: ITickerLiveStatistics;
  // getTickerLiveStatistics: (tickerId: string) => ITickerLiveStatistics;

  candlestickData: ICandlestick[]; // x 100
  getCandlestickChartData: (props: {tickerId: string; timeSpan: ITimeSpanUnion}) => ICandlestick[]; // x 100

  // home page
  // tideBitPromotion: ITideBitPromotion;
  // reserveInformation: IReserveInformation
  getTideBitPromotion: () => ITideBitPromotion;
  getReserveInformation: () => IReserve;

  // getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料

  withdrawOptions: ICryptocurrency[]; // 可供出金的選項
  depositOptions: ICryptocurrency[]; // 可供入金的選項
}
