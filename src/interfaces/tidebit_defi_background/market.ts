import {ICandlestick} from './candlestick';
import {IReserve} from './reserve';
import {ITickerStatic} from './ticker_static';
import {ITickerItem} from './ticker_item';
import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITideBitPromotion} from './tidebit_promotion';
import {ITimeSpanUnion} from './time_span_union';
import {ITransferOption} from './transfer_option';
import {ITicker} from './ticker';

export interface IMarket {
  // TODO: 切換整個交易對資料
  switchTicker: (tickerId: string) => ITicker; // 切換交易對

  tickers: ITickerItem[];
  // availableTickers: ITickerItem[];
  getTickers: (tickerId: string) => ITickerItem[]; // 拿到交易對清單

  isCFDTradable: boolean;
  getIsCFDTradable: (tickerId: string) => boolean; // TODO: parameter

  ticker: ITickerStatic;
  getTicker: (tickerId: string) => ITickerStatic;

  /**
   * + getTickerWithDetails(tickerId)
   * + getCryptocurrencies
   * + getTickerDetails(tickerId)
   * + getCryptocurrencyDetails(cryptocurrencyId)
   */
  // TODO: function name
  tickerLiveStatistics: ITickerLiveStatistics;
  getTickerLiveStatistics: (tickerId: string) => ITickerLiveStatistics;

  candlestickData: ICandlestick[]; // x 100
  getCandlestickChartData: (props: {tickerId: string; timeSpan: ITimeSpanUnion}) => ICandlestick[]; // x 100 // TODO: parameter

  // home page
  // tideBitPromotion: ITideBitPromotion;
  // reserveInformation: IReserveInformation
  getTideBitPromotion: () => ITideBitPromotion;
  getReserveInformation: () => IReserve;

  // getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}
