import {ICFDBrief} from './cfd_brief';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDBrief extends ICFDBrief {
  positionLineGraph: ITickerLineGraph;
}

export const dummyOpenCFDBrief: IOpenCFDBrief = {
  id: 'TBD202302070000001',
  ticker: 'BTC',
  typeOfPosition: 'BUY',
  openPrice: 24058,
  openValue: 74589658,
  pNL: {
    type: 'UP',
    // symbol?: string; // + or -
    value: 1,
  },
  openTimestamp: 1675299651,
  positionLineGraph: {
    dataArray: [
      80, 55, 100, 90, 150, 140, 130, 160, 45, 20, 76, 45, 65, 44, 39, 65, 85, 47, 61, 23, 72, 60,
      65, 42, 25, 32, 20, 15, 32, 90, 10,
    ],
  },
};
