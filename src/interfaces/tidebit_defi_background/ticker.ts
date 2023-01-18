import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITickerStatic} from './ticker_static';

export interface ITicker extends ITickerStatic, ITickerLiveStatistics {
  id: string;
}
