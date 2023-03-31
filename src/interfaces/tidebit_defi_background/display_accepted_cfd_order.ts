import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {ICFDSuggestion} from './cfd_suggestion';
import {IPnL} from './pnl';
import {getDummyApplyCreateCFDOrder} from './apply_create_cfd_order_data';
import {convertApplyCreateCFDToAcceptedCFD} from './apply_cfd_order';
import {randomHex, toDisplayAcceptedCFDOrder} from '../../lib/common';

export interface IDisplayAcceptedCFDOrder extends IAcceptedCFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
  suggestion: ICFDSuggestion;
}

export const getDummyDisplayAcceptedCFDOrder = (currency: string) => {
  const dummyApplyCloseCFDOrder = getDummyApplyCreateCFDOrder(currency);
  const acceptedCFDOrder = convertApplyCreateCFDToAcceptedCFD(
    dummyApplyCloseCFDOrder,
    {currency, available: 10, locked: 0},
    randomHex(32),
    randomHex(32)
  );
  const dummyPositionLineGraph: number[] = [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10];
  const dummyDisplayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(
    acceptedCFDOrder,
    dummyPositionLineGraph
  );
  return dummyDisplayAcceptedCFDOrder;
};

/* TODO: dummyDisplayAcceptedCFDOrder (20230330 - tzuhan)
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const getDummyDisplayAcceptedCFDs = (currency: string) => {
  const dummyDisplayAcceptedCFDs: IDisplayAcceptedCFDOrder[] = [];
  for (let i = 0; i < 3; i++) {
    const profit = Math.random() > 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
    const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
    const date = new Date();
    const dummyDisplayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
      id: `TBDisplay${date.getFullYear()}${
        date.getMonth() + 1
      }${date.getDate()}${date.getSeconds()}${currency}`,
      txid: '0x',
      ticker: currency,
      state: OrderState.CLOSED,
      typeOfPosition: typeOfPosition,
      targetAsset: currency,
      unitAsset: unitAsset,
      openPrice: randomIntFromInterval(1000, 10000),
      amount: 1.8,
      createTimestamp: 1675299651,
      leverage: 5,
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
      takeProfit: 74521,
      stopLoss: 25250,
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: 1675386051,
      closePrice: randomIntFromInterval(1000, 10000),
      closeTimestamp: 1675386051,
      closedType: CFDClosedType.SCHEDULE,
      forcedClose: true,
      remark: 'str',
      pnl: {
        type: profit,
        value: 90752,
      },
      openValue: 24058 * 1.8,
      closeValue: 19537 * 1.8,
      positionLineGraph: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
      suggestion: {takeProfit: 74521, stopLoss: 25250},
      orderType: 'CFD',
      orderStatus: 'FAILED',
    };
    dummyDisplayAcceptedCFDs.push(dummyDisplayAcceptedCFDOrder);
  }
  return dummyDisplayAcceptedCFDs;
};
*/
