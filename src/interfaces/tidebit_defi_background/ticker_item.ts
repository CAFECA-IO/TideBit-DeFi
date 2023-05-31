import {IFluctuating} from './fluctuating';
import {ITickerLineGraph} from './ticker_line_graph';

export interface ITickerItem {
  icon: string;
  id: string;
  currency: string; // token name
  chain: string;
  price: number;
  fluctuating: IFluctuating;
  starred: boolean;
  tokenImg: string; // img src
  lineGraph: ITickerLineGraph;
}
