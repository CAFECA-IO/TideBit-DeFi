import {CFDClosedType, ICFDClosedType} from '../../constants/cfd_closed_type';
import {OrderState} from '../../constants/order_state';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {ICFDDetails} from './cfd_details';
export interface IClosedCFDDetails extends ICFDDetails {
  closedType: ICFDClosedType;
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
  state: OrderState.CLOSED,
  typeOfPosition: TypeOfPosition.BUY,
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
    type: ProfitState.PROFIT,
    value: 90752,
  },
  liquidationPrice: 19537,
  takeProfit: 74521,
  stopLoss: 25250,
  recommendedTp: 35412,
  recommendedSl: 19453,
  closedType: CFDClosedType.SCHEDULE,
  forcedClosed: false,
  closedTimestamp: 5,
  closedValue: 73820133,
};
