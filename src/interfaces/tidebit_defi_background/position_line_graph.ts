import {ITickerLineGraph} from './ticker_line_graph';

export interface IPositionLineGraph extends ITickerLineGraph {
  // id: string; // CFD id
  openPrice: number; // annotated value
}
