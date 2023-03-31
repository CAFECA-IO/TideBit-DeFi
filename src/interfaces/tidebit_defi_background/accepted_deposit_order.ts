import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {dummyDepositOrder, IApplyDepositOrder} from './apply_deposit_order';
import {IDepositOrderSnapshot} from './order_snapshot';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  applyData: IApplyDepositOrder;
  orderSnapshot: IDepositOrderSnapshot;
}

export const getDummyAcceptedDepositOrder = (
  currency = 'ETH',
  orderStatus?: IOrderStatusUnion
): IAcceptedDepositOrder => {
  const date = new Date();

  const id = `TBAcceptedDeposit${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}${date.getSeconds()}${currency}`;

  const txid = randomHex(32);

  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    applyData: dummyDepositOrder,
    orderSnapshot: {
      id,
      orderType: OrderType.DEPOSIT,
      txid,
      targetAsset: currency,
      targetAmount: 2,
      decimals: 18,
      to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      remark: '',
      fee: 0,
    },
    id,
    orderType: OrderType.DEPOSIT,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    targetAsset: dummyDepositOrder.targetAsset,
    targetAmount: dummyDepositOrder.targetAmount,
    userSignature: '',
    balanceDifferenceCauseByOrder: {
      currency: dummyDepositOrder.targetAsset,
      available: 0,
      locked: dummyDepositOrder.targetAmount,
    },
    balanceSnapshot: {
      currency: dummyDepositOrder.targetAsset,
      available: 0,
      locked: dummyDepositOrder.targetAmount,
      createTimestamp: getTimestamp(),
    },
    nodeSignature: '',
    createTimestamp: getTimestamp(),
  };
  return dummyAcceptedDepositOrder;
};

export const dummyAcceptedDepositOrders: IAcceptedDepositOrder[] = [
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.SUCCESS),
];
