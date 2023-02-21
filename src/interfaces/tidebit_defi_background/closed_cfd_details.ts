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

export const getDummyClosedCFDs = (currency: string) => {
  const dummyClosedCFDs: IClosedCFDDetails[] = [];
  for (let i = 0; i < 3; i++) {
    const profit = Math.random() > 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
    const dummyClosedCFD: IClosedCFDDetails = {
      id: `TBD20230217000000${i}`,
      ticker: currency,
      amount: 1.8,
      state: OrderState.CLOSED,
      typeOfPosition: Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL,
      leverage: 5,
      margin: randomIntFromInterval(650, 10000),
      openPrice: randomIntFromInterval(10, 100),
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      openTimestamp: Date.now() / 1000 - i * 60 * 60,
      scheduledClosingTimestamp: Date.now() / 1000 - i * 60 * 60 + 10 * 24 * 60 * 60, // openTimestamp + 86400
      openValue: 74589658,
      pnl: {
        type: profit,
        value: parseInt((Math.random() * 10000).toFixed(0)),
      },
      liquidationPrice: 19537,
      takeProfit: 74521,
      stopLoss: 25250,
      recommendedTp: 35412,
      recommendedSl: 19453,
      closedType: profit === ProfitState.LOSS ? CFDClosedType.STOP_LOSS : CFDClosedType.TAKE_PROFIT,
      forcedClosed: profit === ProfitState.LOSS ? true : false,
      closedTimestamp: 5,
      closedValue: 73820133,
    };
    dummyClosedCFDs.push(dummyClosedCFD);
  }
  return dummyClosedCFDs;
};
