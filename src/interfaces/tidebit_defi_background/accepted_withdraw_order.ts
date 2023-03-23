import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  targetAsset: string;
  targetAmount: number;
  // decimals: number;
  to: string;
}


export const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
  id: '001',
  txid: '0x',
  orderType: OrderType.WITHDRAW,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  targetAmount: 7.91,
  to: '0x',
  decimals: 18,
  fee: 0
}

export const getDummyAcceptedWithdrawOrder = (currency = 'ETH'): IAcceptedWithdrawOrder => {
  const date = new Date();
  const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
    id: `TBAcceptedWithdraw${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    orderType: OrderType.WITHDRAW,
    createTimestamp: getTimestamp(),
    orderStatus: OrderStatusUnion.SUCCESS,
    targetAsset: currency,
    targetAmount: 7.91,
    to: '0x',
    // decimals: 18,
    fee: 0,
  };
  return dummyAcceptedWithdrawOrder;
};
