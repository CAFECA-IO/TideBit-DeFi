import {CFDOperation} from '../../constants/cfd_order_type';
import {unitAsset} from '../../constants/config';
import {OrderType} from '../../constants/order_type';
import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {getTimestamp} from '../../lib/common';
import {IApplyCFDOrder} from './apply_cfd_order';
import {IMargin} from './margin';
import {getDummyQuotation, IQuotation} from './quotation';

export interface IApplyCreateCFDOrder extends IApplyCFDOrder {
  ticker: string;
  quotation: IQuotation; // 報價單
  typeOfPosition: ITypeOfPosition;
  price: number;
  amount: number;
  targetAsset: string;
  unitAsset: string;
  margin: IMargin;
  leverage: number;
  liquidationPrice: number; // 強制平倉價格
  liquidationTime: number;
  guaranteedStop: boolean;
  guaranteedStopFee?: number;
  createTimestamp?: number;
  takeProfit?: number;
  stopLoss?: number;
  fee: number;
  remark?: string;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyCreateCFDOrder = (currency: string) => {
  const typeOfPosition = Math.random() > 0.5 ? TypeOfPosition.BUY : TypeOfPosition.SELL;
  const dummyApplyCreateCFDOrder: IApplyCreateCFDOrder = {
    orderType: OrderType.CFD,
    operation: CFDOperation.CREATE,
    ticker: currency,
    amount: 1.8,
    typeOfPosition: typeOfPosition,
    leverage: 5,
    price: randomIntFromInterval(1000, 10000),
    targetAsset: currency,
    unitAsset: unitAsset,
    margin: {asset: unitAsset, amount: randomIntFromInterval(10, 100)},
    takeProfit: 74521,
    stopLoss: 25250,
    fee: 0,
    quotation: getDummyQuotation(currency, typeOfPosition), // 報價單
    liquidationPrice: randomIntFromInterval(1000, 10000),
    liquidationTime: getTimestamp() + 86400, // openTimestamp + 86400
    guaranteedStop: false,
  };
  return dummyApplyCreateCFDOrder;
};
