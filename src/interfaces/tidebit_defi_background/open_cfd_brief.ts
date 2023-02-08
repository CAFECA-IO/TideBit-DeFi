import PositionLineGraph from '../../components/position_line_graph/position_line_graph';
import {ICFDBrief} from './cfd_brief';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDBrief extends ICFDBrief {
  positionLineGraph: ITickerLineGraph;
}

export const dummyOpenCFDBrief: IOpenCFDBrief = {
  id: 'TBD202302080000001',
  ticker: 'BTC',
  typeOfPosition: 'BUY',
  openPrice: 24.5,
  openValue: 656.9,
  openTimestamp: 14,
  pNL: {
    type: 'UP',
    symbol: '+',
    value: 90752,
  },
  positionLineGraph: {dataArray: [153000, 137200, 122000, 126500, 134200, 129900]},
};
