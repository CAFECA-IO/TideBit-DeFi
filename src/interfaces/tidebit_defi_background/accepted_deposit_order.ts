import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {dummyDepositOrder, IApplyDepositOrder} from './apply_deposit_order';
import {IDepositReceipt} from './receipt';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  applyData: IApplyDepositOrder;
  receipt: IDepositReceipt;
}

export const getDummyAcceptedDepositOrder = (
  currency?: string,
  orderStatus?: IOrderStatusUnion
): IAcceptedDepositOrder => {
  const txid = randomHex(32);
  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    txid,
    applyData: dummyDepositOrder,
    userSignature: randomHex(32),
    receipt: {
      order: {
        ...dummyDepositOrder,
        /** Info: dummyDepositOrder provide all the info below (20230412 - tzuhan)
        orderType: OrderType.DEPOSIT,
        targetAmount: dummyDepositOrder.targetAmount,
        decimals: dummyDepositOrder.decimals,
        to: dummyDepositOrder.to,
        remark: dummyDepositOrder.remark,
        fee: dummyDepositOrder.fee,
         */
        id: randomHex(20),
        txid,
        orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
        targetAsset: currency || dummyDepositOrder.targetAsset,
      },
      balance: {
        currency: currency || dummyDepositOrder.targetAsset,
        available: 100,
        locked: dummyDepositOrder.targetAmount,
      },
    },
    nodeSignature: randomHex(32),
    createTimestamp: getTimestamp(),
  };
  return dummyAcceptedDepositOrder;
};

export const dummyAcceptedDepositOrders: IAcceptedDepositOrder[] = [
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.CANCELDED),
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.SUCCESS),
];
