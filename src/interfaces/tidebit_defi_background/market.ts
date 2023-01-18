import {ICandlestick} from './candlestick';
import {IReserve} from './reserve';
import {ITickerDetails} from './ticker_details';
import {ITickerItem} from './ticker_item';
import {ITideBitPromotion} from './tidebit_promotion';
import {ITimeSpanUnion} from './time_span_union';
import {ITransferOption} from './transfer_option';

export interface IMarket {
  tickers: ITickerItem[];

  availableTickers: ITickerItem[];
  // getTickers: (id: number) => ITickerData[]; // 拿到交易對清單

  nowPrice: number;
  isCFDTradable: boolean;
  tickerDetails: ITickerDetails;
  candlestickData: ICandlestick[]; // x 100

  // home page
  // tideBitPromotion: ITideBitPromotion;
  // reserveInformation: IReserveInformation
  getTideBitPromotion: () => ITideBitPromotion;
  getReserveInformation: () => IReserve;

  // getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料
  getCandlestickData: (props: {ticker: string; timeSpan: ITimeSpanUnion}) => ICandlestick[]; // x 100

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}
