import {ICFDBrief} from './cfd_brief';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDBrief extends ICFDBrief {
  remainingHrs: number;
  positionLineGraph: ITickerLineGraph;
}
