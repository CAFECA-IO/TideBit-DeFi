import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  targetAsset: string;
  targetAmount: number;
  decimals: number;
  to: string;
}

export const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
  id: '001',
  txid: '0x',
  orderType: OrderType.DEPOSIT,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  decimals: 18,
  targetAmount: 7.91,
  to: '0x',
  fee: 0
}

export const getDummyAcceptedDepositOrder = (currency = 'ETH'): IAcceptedDepositOrder => {
  const date = new Date();
  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    id: `TBAcceptedDeposit${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    orderType: OrderType.DEPOSIT,
    createTimestamp: getTimestamp(),
    orderStatus: OrderStatusUnion.SUCCESS,
    targetAsset: currency,
    decimals: 18,
    targetAmount: 7.91,
    to: '0x',
    fee: 0,
  };
  return dummyAcceptedDepositOrder;
};
