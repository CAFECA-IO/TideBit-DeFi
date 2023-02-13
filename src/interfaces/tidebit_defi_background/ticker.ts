import {ICandlestick} from './candlestick';
import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITickerStatic} from './ticker_static';
import {ITimeSpanUnion} from './time_span_union';

export interface ITicker extends ITickerStatic, ITickerLiveStatistics {
  // icon: string;

  id: string;
  isCFDTradable: boolean;

  candlestickData: ICandlestick[]; // x 100
}
