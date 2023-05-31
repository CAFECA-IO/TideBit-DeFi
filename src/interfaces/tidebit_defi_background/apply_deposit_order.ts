import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedDepositOrder} from './accepted_deposit_order';
import {IApplyOrder} from './apply_order';
import {IBalance} from './balance';
export interface IApplyDepositOrder extends IApplyOrder {
  blockchain: string;
  txhash: string;
  targetAsset: string;
  targetAmount: number;
  fee?: number;
  remark?: string;
}

export const dummyDepositOrder: IApplyDepositOrder = {
  orderType: OrderType.DEPOSIT,
  targetAsset: 'USDT',
  targetAmount: 2000,
  txhash: randomHex(32),
  blockchain: '0x8000003c',
};

export const convertApplyDepositOrderToAcceptedDepositOrder = (
  applyDepositOrder: IApplyDepositOrder,
  balance: IBalance,
  ethereumTxHash: string,
  droneSignature: string,
  locutusSignature: string
) => {
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
  const accpetedDepositOrder: IAcceptedDepositOrder = {
    id,
    orderType: OrderType.DEPOSIT,
    sequence,
    txhash,
    applyData: applyDepositOrder,
    userSignature: randomHex(32),
    receipt: {
      txhash,
      sequence,
      orderSnapshot: {
        id: randomHex(20),
        orderType: OrderType.DEPOSIT,
        orderStatus: OrderStatusUnion.WAITING,
        txhash,
        targetAsset: applyDepositOrder.targetAsset,
        targetAmount: applyDepositOrder.targetAmount,
        ethereumTxHash: ethereumTxHash,
        createTimestamp: timestamp,
        updatedTimestamp: timestamp,
        fee: 0,
      },
      balanceSnapshot: [
        {
          currency: applyDepositOrder.targetAsset,
          available: balance.available,
          locked: balance.locked + applyDepositOrder.targetAmount,
        },
      ],
    },
    createTimestamp: timestamp,
    droneSignature: droneSignature,
    locutusSignature: locutusSignature,
  };
  return accpetedDepositOrder;
};
