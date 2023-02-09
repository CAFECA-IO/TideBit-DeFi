import {ICFDDetails} from './cfd_details';

export interface IClosedCFDDetails extends ICFDDetails {
  state: 'CLOSED';
  closedType: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;
  closedTimestamp: number; // remaining hrs gained from context
  closedValue: number;
}

export const dummyCloseCFDDetails: IClosedCFDDetails = {
  id: 'TBD202302070000002',
  ticker: 'ETH',
  amount: 1.8,
  state: 'CLOSED',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: 650,
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
  closedType: 'STOP_LOSS',
  forcedClosed: true,
  closedTimestamp: 1675399651, // remaining hrs gained from context
  closedValue: 25250,
};
