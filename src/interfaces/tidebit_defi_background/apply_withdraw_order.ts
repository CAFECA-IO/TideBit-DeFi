import {OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';
import {getTimestamp, randomHex} from '../../lib/common';
import {IAcceptedWithdrawOrder} from './accepted_withdraw_order';
import {IApplyOrder} from './apply_order';
import {IBalance} from './balance';

export interface IApplyWithdrawOrder extends IApplyOrder {
  orderType: IOrderType;
  createTimestamp?: number;
  targetAsset: string;
  targetAmount: number;
  // decimals: number;
  to: string;
  remark?: string;
  fee: number;
}

export const dummyWithdrawOrder: IApplyWithdrawOrder = {
  orderType: OrderType.WITHDRAW,
  createTimestamp: getTimestamp(),
  targetAsset: 'USDT',
  targetAmount: 1,
  to: '0x',
  remark: '',
  // decimals: 18,
  fee: 0,
};

export const convertApplyWithdrawOrderToAcceptedWithdrawOrder = (
  applyWithdrawOrder: IApplyWithdrawOrder,
  balance: IBalance,
  userSignature: string,
  droneSignature: string,
  locutusSignature: string
) => {
  const id = randomHex(20);
  const txhash = randomHex(32);
  const timestamp = getTimestamp();
  const sequence = Math.ceil(Math.random() * 10000);
  const accpetedWithdrawOrder: IAcceptedWithdrawOrder = {
    id,
    orderType: OrderType.WITHDRAW,
    sequence,
    txhash,
    applyData: applyWithdrawOrder,
    userSignature,
    receipt: {
      txhash,
      sequence,
      orderSnapshot: {
        ...applyWithdrawOrder,
        id: randomHex(20),
        orderType: OrderType.WITHDRAW,
        orderStatus: OrderStatusUnion.WAITING,
        txhash,
        targetAsset: applyWithdrawOrder.targetAsset,
        targetAmount: applyWithdrawOrder.targetAmount,
        createTimestamp: timestamp,
        updatedTimestamp: timestamp,
        fee: 0,
      },
      balanceSnapshot: [
        {
          currency: applyWithdrawOrder.targetAsset,
          available: balance.available,
          locked: balance.locked + applyWithdrawOrder.targetAmount,
        },
      ],
    },
    createTimestamp: timestamp,
    droneSignature: droneSignature,
    locutusSignature: locutusSignature,
  };
  return accpetedWithdrawOrder;
};
