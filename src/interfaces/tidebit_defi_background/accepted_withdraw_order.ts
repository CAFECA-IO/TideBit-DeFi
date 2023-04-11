import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {dummyWithdrawOrder, IApplyWithdrawOrder} from './apply_withdraw_order';
import {IWithdrawOrderSnapshot} from './order_snapshot';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  applyData: IApplyWithdrawOrder;
  orderSnapshot: IWithdrawOrderSnapshot;
}

export const getDummyAcceptedWithdrawOrder = (
  currency = 'ETH',
  orderStatus?: IOrderStatusUnion
): IAcceptedWithdrawOrder => {
  const date = new Date();

  const id = `TBAcceptedWithdraw${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}${date.getSeconds()}${currency}`;

  const txid = randomHex(32);

  const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
    applyData: dummyWithdrawOrder,
    orderSnapshot: {
      id,
      orderType: OrderType.WITHDRAW,
      txid,
      targetAsset: currency,
      targetAmount: 2,
      to: randomHex(20),
      remark: '',
      fee: 0,
    },
    id,
    orderType: OrderType.WITHDRAW,
    orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
    targetAsset: dummyWithdrawOrder.targetAsset,
    targetAmount: dummyWithdrawOrder.targetAmount,
    userSignature: '',
    balanceDifferenceCauseByOrder: {
      currency: dummyWithdrawOrder.targetAsset,
      available: 0,
      locked: dummyWithdrawOrder.targetAmount,
    },
    balanceSnapshot: {
      currency: dummyWithdrawOrder.targetAsset,
      available: 0,
      locked: dummyWithdrawOrder.targetAmount,
      createTimestamp: getTimestamp(),
    },
    nodeSignature: '',
    createTimestamp: getTimestamp(),
  };
  return dummyAcceptedWithdrawOrder;
};

export const dummyAcceptedWithdrawrders = [
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.SUCCESS),
];
