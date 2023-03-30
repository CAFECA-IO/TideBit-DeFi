import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {IBalance} from './balance';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  targetAsset: string;
  targetAmount: number;
  decimals: number;
  to: string;
  balanceSnapshot: IBalance;
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
  fee: 0,
  balanceSnapshot: {
    currency: 'ETH',
    available: 2000,
    locked: 0,
  },
};

export const getDummyAcceptedDepositOrder = (currency = 'ETH'): IAcceptedDepositOrder => {
  const date = new Date();

  const orderStatus =
    Math.random() > 0.5
      ? OrderStatusUnion.SUCCESS
      : Math.random() === 0.5
      ? OrderStatusUnion.PROCESSING
      : OrderStatusUnion.FAILED;

  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    id: `TBAcceptedDeposit${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    txid: randomHex(32),
    orderType: OrderType.DEPOSIT,
    createTimestamp: getTimestamp(),
    orderStatus,
    remark: '',
    targetAsset: currency,
    decimals: 18,
    targetAmount: 20,
    to: '0x',
    fee: 0,
    balanceSnapshot: {
      currency,
      available: 2000 + orderStatus === OrderStatusUnion.SUCCESS ? 20 : 0,
      locked:
        orderStatus === OrderStatusUnion.PROCESSING || orderStatus === OrderStatusUnion.WAITING
          ? 20
          : 0,
    },
  };
  return dummyAcceptedDepositOrder;
};
