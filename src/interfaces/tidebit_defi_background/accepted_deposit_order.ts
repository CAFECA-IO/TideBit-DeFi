import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
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
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    id,
    orderType: OrderType.DEPOSIT,
    sequence,
    txhash,
    applyData: dummyDepositOrder,
    userSignature: randomHex(32),
    receipt: {
      txhash,
      sequence,
      orderSnapshot: {
        id: randomHex(20),
        orderType: OrderType.DEPOSIT,
        txhash,
        orderStatus: orderStatus ? orderStatus : OrderStatusUnion.WAITING,
        targetAsset: currency || dummyDepositOrder.targetAsset,
        targetAmount: dummyDepositOrder.targetAmount,
        ethereumTxHash: randomHex(32),
        createTimestamp: timestamp,
        updatedTimestamp: timestamp,
        fee: 0,
      },
      balanceSnapshot: [
        {
          currency: currency || dummyDepositOrder.targetAsset,
          available: 100,
          locked: dummyDepositOrder.targetAmount,
        },
      ],
    },
    droneSignature: randomHex(32),
    locutusSignature: randomHex(32),
    createTimestamp: timestamp,
  };
  return dummyAcceptedDepositOrder;
};

export const dummyAcceptedDepositOrders: IAcceptedDepositOrder[] = [
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.CANCELDED),
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.WAITING),
  getDummyAcceptedDepositOrder('ETH', OrderStatusUnion.SUCCESS),
];
