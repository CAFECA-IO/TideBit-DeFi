import {ICFDDetails} from './cfd_details';
import {ITickerLineGraph} from './ticker_line_graph';

export interface IOpenCFDDetails extends ICFDDetails {
  positionLineGraph: ITickerLineGraph;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const dummyOpenCFDDetails: IOpenCFDDetails = {
  id: 'TBD202302070000001',
  ticker: 'ETH',
  amount: 1.8,
  state: 'OPENING',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: randomIntFromInterval(650, 10000),
  openPrice: randomIntFromInterval(10, 100),
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
};
