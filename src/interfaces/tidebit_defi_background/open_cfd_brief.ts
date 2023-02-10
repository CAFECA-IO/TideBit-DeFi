import PositionLineGraph from '../../components/position_line_graph/position_line_graph';
import {ICFDBrief} from './cfd_brief';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDBrief extends ICFDBrief {
  positionLineGraph: ITickerLineGraph;
}

export const dummyOpenCFDBriefs: IOpenCFDBrief[] = [
  {
    id: 'TBD202302070000001',
    ticker: 'BTC',
    typeOfPosition: 'BUY',
    openPrice: 24058,
    openValue: 74589658,
    pNL: {
      type: 'EQUAL',
      // symbol?: string; // + or -
      value: 0,
    },
    openTimestamp: 1675299651,
    positionLineGraph: {
      dataArray: [153000, 137200, 122000, 126500, 134200, 129900],
    },
  },
  {
    id: 'TBD202302070000002',
    ticker: 'BTC',
    typeOfPosition: 'SELL',
    openPrice: 24058,
    openValue: 74589658,
    pNL: {
      type: 'DOWN',
      // symbol?: string; // + or -
      value: 29,
    },
    openTimestamp: 1675299651,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD202302070000003',
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
  },
];
