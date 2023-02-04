import {ICFDDetails} from './cfd_details';

export interface IOpenCFDDetails extends ICFDDetails {
  state: 'OPENING';
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const dummyOpenCFDDetails: IOpenCFDDetails = {
  id: '123',
  ticker: 'ETH',
  amount: 1.8,
  state: 'OPENING',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: randomIntFromInterval(650, 10000),
  openPrice: 24058,
  fee: 0,
  guranteedStop: false,
  guranteedStopFee: 0.77,
  openTimestamp: 1675299651,
  scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
  openValue: 74589658,
  pnl: {
    type: 'UP',
    symbol: '+',
    value: 90752,
  },
  liquidationPrice: 19537,
  stopLoss: 20102,
  recommendedTp: 35412,
  recommendedSl: 19453,
};
