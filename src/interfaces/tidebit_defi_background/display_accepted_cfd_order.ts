import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {ICFDSuggestion} from './cfd_suggestion';
import {IPnL} from './pnl';
import {CFDClosedType} from '../../constants/cfd_closed_type';
import {OrderState} from '../../constants/order_state';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {unitAsset} from '../../constants/config';

export interface IDisplayAcceptedCFDOrder extends IAcceptedCFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
  suggestion: ICFDSuggestion;
}

export const toDisplayAcceptedCFDOrder = (acceptedCFDOrder: IAcceptedCFDOrder) => {
  // TODO: calculate pnl (20230323 - tzuhan)
  const pnlValue = 0;
  // TODO: get positionLineGraph (20230323 - tzuhan)
  const positionLineGraph = [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10];
  // TODO: get suggestion (20230323 - tzuhan)
  const suggestion = {takeProfit: 74521, stopLoss: 25250};
  const displayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
    ...acceptedCFDOrder,
    pnl: {
      type: ProfitState.PROFIT,
      value: pnlValue,
    },
    openValue: acceptedCFDOrder.openPrice * acceptedCFDOrder.amount,
    closeValue: acceptedCFDOrder.closePrice
      ? acceptedCFDOrder.closePrice * acceptedCFDOrder.amount
      : undefined,
    positionLineGraph,
    suggestion,
  };
  return displayAcceptedCFDOrder;
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyDisplayAcceptedCFDOrder = (currency: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const dummyDisplayAcceptedCFDOrder: IDisplayAcceptedCFDOrder = {
    id: 'TBD202302070000001',
    txid: '0x',
    ticker: currency,
    state:
      Math.random() > 0.5
        ? OrderState.CLOSED
        : Math.random() === 0.5
        ? OrderState.FREEZED
        : OrderState.OPENING,
    typeOfPosition: typeOfPosition,
    targetAsset: currency,
    unitAsset: unitAsset,
    openPrice: 24058,
    amount: 1.8,
    createTimestamp: 1675299651,
    leverage: 5,
    margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
    takeProfit: 74521,
    stopLoss: 25250,
    fee: 0,
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
    liquidationPrice: 19537,
    liquidationTime: 1675386051,
    closePrice: 19537,
    closeTimestamp: 1675386051,
    closedType: CFDClosedType.SCHEDULE,
    forcedClose: true,
    remark: 'str',
    pnl: {
      type: ProfitState.PROFIT,
      value: 90752,
    },
    openValue: 24058 * 1.8,
    closeValue: 19537 * 1.8,
    positionLineGraph: [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10],
    suggestion: {takeProfit: 74521, stopLoss: 25250},
    orderType: 'CFD',
    orderStatus: 'FAILED',
  };
  return dummyDisplayAcceptedCFDOrder;
};

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
