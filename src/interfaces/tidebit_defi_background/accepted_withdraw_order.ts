import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {dummyWithdrawOrder, IApplyWithdrawOrder} from './apply_withdraw_order';
import {IWithdrawReceipt} from './receipt';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  applyData: IApplyWithdrawOrder;
  receipt: IWithdrawReceipt;
}

export const getDummyAcceptedWithdrawOrder = (
  currency?: string,
  orderStatus?: IOrderStatusUnion
): IAcceptedWithdrawOrder => {
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
  const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
    id,
    orderType: OrderType.WITHDRAW,
    sequence,
    txhash,
    applyData: dummyWithdrawOrder,
    userSignature: randomHex(32),
    receipt: {
      txhash,
      sequence,
      orderSnapshot: {
        id: randomHex(20),
        orderType: OrderType.WITHDRAW,
        txhash,
        orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
        targetAsset: currency || dummyWithdrawOrder.targetAsset,
        targetAmount: dummyWithdrawOrder.targetAmount,
        createTimestamp: timestamp,
        updatedTimestamp: timestamp,
        fee: 0,
      },
      balanceSnapshot: [
        {
          currency: currency || dummyWithdrawOrder.targetAsset,
          available: 100 - dummyWithdrawOrder.targetAmount,
          locked: dummyWithdrawOrder.targetAmount,
        },
      ],
    },
    droneSignature: randomHex(32),
    locutusSignature: randomHex(32),
    createTimestamp: timestamp,
  };
  return dummyAcceptedWithdrawOrder;
};

export const dummyAcceptedWithdrawrders = [
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.PROCESSING),
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.FAILED),
];
