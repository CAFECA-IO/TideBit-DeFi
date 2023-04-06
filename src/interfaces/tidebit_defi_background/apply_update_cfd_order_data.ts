import {CFDOperation, ICFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {IApplyCFDOrder} from './apply_cfd_order';

export interface IApplyUpdateCFDOrder extends IApplyCFDOrder {
  operation: ICFDOperation;
  referenceId: string;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDummyApplyUpdateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyUpdateCFDOrder: IApplyUpdateCFDOrder = {
    orderType: OrderType.CFD,
    operation: CFDOperation.UPDATE,
    referenceId: id
      ? id
      : `TB${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}${date.getSeconds()}${currency}`,
    takeProfit: randomIntFromInterval(7000, 70000),
    stopLoss: randomIntFromInterval(100, 1000),
    guaranteedStop: false,
    guaranteedStopFee: 0.77,
  };
  return dummyApplyUpdateCFDOrder;
};
