import {OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';
import {getTimestamp} from '../../lib/common';
import {IAcceptedWithdrawOrder} from './accepted_withdraw_order';
import {IApplyOrder} from './apply_order';

export interface IApplyWithdrawOrder extends IApplyOrder {
  orderType: IOrderType;
  createTimestamp?: number;
  targetAsset: string;
  targetAmount: number;
  // decimals: number;
  to: string;
  remark?: string;
  fee: number;
}

export const dummyWithdrawOrder: IApplyWithdrawOrder = {
  orderType: OrderType.WITHDRAW,
  createTimestamp: getTimestamp(),
  targetAsset: 'USDT',
  targetAmount: 1,
  to: '0x',
  remark: '',
  // decimals: 18,
  fee: 0,
};

export const convertApplyWithdrawOrderToAcceptedWithdrawOrder = (
  applyWithdrawOrder: IApplyWithdrawOrder
) => {
  const date = new Date();
  const id = `CFD${date.getTime()}${applyWithdrawOrder.targetAsset}${Math.ceil(
    Math.random() * 1000000000
  )}`;
  const accpetedWithdrawOrder: IAcceptedWithdrawOrder = {
    ...applyWithdrawOrder,
    id,
    orderStatus: OrderStatusUnion.WAITING,
    createTimestamp: applyWithdrawOrder.createTimestamp
      ? applyWithdrawOrder.createTimestamp
      : getTimestamp(),
  };
  return accpetedWithdrawOrder;
};
