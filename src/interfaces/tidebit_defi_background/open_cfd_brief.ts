import PositionLineGraph from '../../components/position_line_graph/position_line_graph';
import {ICFDBrief} from './cfd_brief';
import {ITickerLineGraph} from './ticker_line_graph';

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export interface IOpenCFDBrief extends ICFDBrief {
  positionLineGraph: ITickerLineGraph;
}

export const dummyOpenCFDBriefs: IOpenCFDBrief[] = [
  {
    id: 'TBD20230207001',
    ticker: 'ETH',
    amount: 100,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 100,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: 'UP',
      symbol: '+',
      value: 90752,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207002',
    ticker: 'ETH',
    amount: 200,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 200,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: 'UP',
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207003',
    ticker: 'ETH',
    amount: 300,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 300,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: 'UP',
      symbol: '+',
      value: 9075200,
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
  {
    id: 'TBD20230207004',
    ticker: 'ETH',
    amount: 400,
    state: 'OPENING',
    typeOfPosition: 'BUY',
    leverage: 5,
    margin: 400,
    openPrice: 24058,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    openTimestamp: 1675299651,
    scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
    openValue: 74589658,
    pnl: {
      type: 'UP',
      symbol: '+',
      value: randomIntFromInterval(1000, 10000),
    },
    liquidationPrice: 19537,
    takeProfit: 74521,
    stopLoss: 25250,
    recommendedTp: 35412,
    recommendedSl: 19453,
    positionLineGraph: {
      dataArray: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    },
  },
];

export const dummyOpenCFDBrief = dummyOpenCFDBriefs[0];
