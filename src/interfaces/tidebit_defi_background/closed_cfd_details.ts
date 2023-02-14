import {ICFDDetails} from './cfd_details';
export interface IClosedCFDDetails extends ICFDDetails {
  closedType: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean; // 強制執行
  closedTimestamp: number;
  closedValue: number;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const dummyCloseCFDDetails: IClosedCFDDetails = {
  id: 'TBD202302070000001',
  ticker: 'ETH',
  amount: 1.8,
  state: 'CLOSED',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: randomIntFromInterval(650, 10000),
  openPrice: 24058,
  fee: 0,
  guaranteedStop: false,
  guaranteedStopFee: 0.77,
  openTimestamp: 1675299651,
  scheduledClosingTimestamp: 1675386051, // openTimestamp + 86400
  openValue: 74589658,
  pnl: {
    type: 'PROFIT',
    // symbol: '+',
    value: 90752,
  },
  liquidationPrice: 19537,
  takeProfit: 74521,
  stopLoss: 25250,
  recommendedTp: 35412,
  recommendedSl: 19453,
  closedType: 'SCHEDULE',
  forcedClosed: false,
  closedTimestamp: 5,
  closedValue: 73820133,
};
