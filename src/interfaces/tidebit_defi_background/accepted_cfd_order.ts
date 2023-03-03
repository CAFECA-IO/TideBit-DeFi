import {CFDClosedType, ICFDClosedType} from '../../constants/cfd_closed_type';
import {IOrderState, OrderState} from '../../constants/order_state';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';

export interface IAcceptedCFDOrder {
  id: string;
  ticker: string;
  state: IOrderState;
  typeOfPosition: ITypeOfPosition;
  targetAsset: string;
  uniAsset: string;
  openPrice: number;
  amount: number;
  createTimestamp?: number;
  leverage: number;
  margin: IMargin;
  takeProfit?: number;
  stopLoss?: number;
  fee: number;
  guaranteedStop: boolean;
  guaranteedStopFee?: number;
  liquidationPrice: number;
  liquidationTime: number;
  closePrice?: number;
  closeTimestamp?: number;
  closedType?: ICFDClosedType;
  forcedClose?: boolean;
  remark?: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyAcceptedCFDOrder = (currency: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const date = new Date();
  const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
    id: `TBAccepted${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    ticker: currency,
    state:
      Math.random() > 0.5
        ? OrderState.CLOSED
        : Math.random() === 0.5
        ? OrderState.FREEZED
        : OrderState.OPENING,
    typeOfPosition: typeOfPosition,
    targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
    uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
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
    liquidationTime: 1675386051, // openTimestamp + 86400
    closePrice: 19537,
    closeTimestamp: 1675386051,
    closedType: CFDClosedType.SCHEDULE,
    forcedClose: true,
    remark: 'str',
  };
  return dummyAcceptedCFDOrder;
};

export const getDummyAcceptedCFDs = (currency: string) => {
  const dummyAcceptedCFDs: IAcceptedCFDOrder[] = [];
  for (let i = 0; i < 3; i++) {
    const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
    const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
      id: 'TBD202302070000001',
      ticker: currency,
      state:
        Math.random() > 0.5
          ? OrderState.CLOSED
          : Math.random() === 0.5
          ? OrderState.FREEZED
          : OrderState.OPENING,
      typeOfPosition: typeOfPosition,
      targetAsset: typeOfPosition === TypeOfPosition.BUY ? currency : 'USDT',
      uniAsset: typeOfPosition === TypeOfPosition.BUY ? 'USDT' : currency,
      openPrice: randomIntFromInterval(1000, 10000),
      amount: 1.8,
      createTimestamp: Date.now() / 1000,
      leverage: 5,
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
      takeProfit: randomIntFromInterval(7000, 70000),
      stopLoss: randomIntFromInterval(100, 1000),
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: Date.now() / 1000 + 86400,
      closePrice: randomIntFromInterval(1000, 10000),
      closeTimestamp: Date.now() / 1000 + 86400,
      closedType: CFDClosedType.SCHEDULE,
      forcedClose: true,
      remark: 'str',
    };
    dummyAcceptedCFDs.push(dummyAcceptedCFDOrder);
  }
  return dummyAcceptedCFDs;
};
