import {CFDClosedType, ICFDClosedType} from '../../constants/cfd_closed_type';
import {unitAsset} from '../../constants/config';
import {IOrderState, OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {IMargin} from './margin';

export interface IAcceptedCFDOrder extends IAcceptedOrder {
  ticker: string;
  state: IOrderState;
  typeOfPosition: ITypeOfPosition;
  targetAsset: string;
  unitAsset: string;
  openPrice: number;
  amount: number;
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

export const getDummyAcceptedCFDOrder = (currency = 'ETH', state?: IOrderState) => {
  const random = Math.random();
  const typeOfPosition = random > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const date = new Date();
  const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
    id: `TBAcceptedCFD${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    ticker: currency,
    orderStatus: random > 0.5 ? OrderStatusUnion.PROCESSING : OrderStatusUnion.SUCCESS,
    orderType: OrderType.CFD,
    state: state
      ? state
      : random > 0.5
      ? OrderState.CLOSED
      : random === 0.5
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
    liquidationTime: 1675386051, // openTimestamp + 86400
    closePrice: 19537,
    closeTimestamp: 1675386051,
    closedType: CFDClosedType.SCHEDULE,
    forcedClose: true,
    remark: 'str',
  };
  return dummyAcceptedCFDOrder;
};

export const getDummyAcceptedCFDs = (currency: string, state?: IOrderState, id?: string) => {
  const date = new Date();
  const dummyAcceptedCFDs: IAcceptedCFDOrder[] = [];
  for (let i = 0; i < 3; i++) {
    const random = Math.random();
    const typeOfPosition = random > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
    const dummyAcceptedCFDOrder: IAcceptedCFDOrder = {
      id: id
        ? id
        : `TBAcceptedCFD${date.getFullYear()}${
            date.getMonth() + 1
          }${date.getDate()}${date.getSeconds()}${currency}-${i}`,
      ticker: currency,
      orderStatus: random > 0.5 ? OrderStatusUnion.SUCCESS : OrderStatusUnion.PROCESSING,
      orderType: OrderType.CFD,
      state: state
        ? state
        : random > 0.5
        ? OrderState.CLOSED
        : random === 0.5
        ? OrderState.FREEZED
        : OrderState.OPENING,
      typeOfPosition: typeOfPosition,
      targetAsset: currency,
      unitAsset: unitAsset,
      openPrice: randomIntFromInterval(1000, 10000),
      amount: 1.8,
      createTimestamp: getTimestamp(),
      leverage: 5,
      margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)},
      takeProfit: randomIntFromInterval(7000, 70000),
      stopLoss: randomIntFromInterval(100, 1000),
      fee: 0,
      guaranteedStop: false,
      guaranteedStopFee: 0.77,
      liquidationPrice: randomIntFromInterval(1000, 10000),
      liquidationTime: getTimestamp() + 86400,
      closePrice: randomIntFromInterval(1000, 10000),
      closeTimestamp: random > 0.5 ? getTimestamp() + 86400 : undefined,
      closedType:
        random > 0.5
          ? Math.random() > 0.5
            ? CFDClosedType.FORCED_LIQUIDATION
            : CFDClosedType.SCHEDULE
          : undefined,
      forcedClose: true,
      remark: 'str',
    };
    dummyAcceptedCFDs.push(dummyAcceptedCFDOrder);
  }
  return dummyAcceptedCFDs;
};
