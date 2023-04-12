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
  const txid = randomHex(32);
  const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
    txid,
    applyData: dummyWithdrawOrder,
    userSignature: randomHex(32),
    receipt: {
      order: {
        ...dummyWithdrawOrder,
        /** Info: dummyWithdrawOrder provide all the info below (20230412 - tzuhan)
        orderType: OrderType.WITHDRAW,
        targetAmount: dummyWithdrawOrder.targetAmount,
        decimals: dummyWithdrawOrder.decimals,
        to: dummyWithdrawOrder.to,
        remark: dummyWithdrawOrder.remark,
        fee: dummyWithdrawOrder.fee,
         */
        id: randomHex(20),
        txid,
        orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
        targetAsset: currency || dummyWithdrawOrder.targetAsset,
      },
      balance: {
        currency: currency || dummyWithdrawOrder.targetAsset,
        available: 100 - dummyWithdrawOrder.targetAmount,
        locked: dummyWithdrawOrder.targetAmount,
      },
    },
    nodeSignature: randomHex(32),
    createTimestamp: getTimestamp(),
  };
  return dummyAcceptedWithdrawOrder;
};

export const dummyAcceptedWithdrawrders = [
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.PROCESSING),
  getDummyAcceptedWithdrawOrder('ETH', OrderStatusUnion.FAILED),
];
