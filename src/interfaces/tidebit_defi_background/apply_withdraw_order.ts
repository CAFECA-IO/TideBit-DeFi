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
  nodeSignature: string
) => {
  const date = new Date();
  const id = `${OrderType.WITHDRAW}${date.getTime()}${applyWithdrawOrder.targetAsset}${Math.ceil(
    Math.random() * 1000000000
  )}`;
  const txid = randomHex(32);
  const accpetedWithdrawOrder: IAcceptedWithdrawOrder = {
    ...applyWithdrawOrder,
    id,
    orderStatus: OrderStatusUnion.WAITING,
    createTimestamp: applyWithdrawOrder.createTimestamp
      ? applyWithdrawOrder.createTimestamp
      : getTimestamp(),
    applyData: applyWithdrawOrder,
    orderSnapshot: {...applyWithdrawOrder, txid, id},
    userSignature: userSignature,
    balanceDifferenceCauseByOrder: {
      currency: applyWithdrawOrder.targetAsset,
      available: -applyWithdrawOrder.targetAmount,
      locked: applyWithdrawOrder.targetAmount,
    },
    balanceSnapshot: {
      currency: applyWithdrawOrder.targetAsset,
      available: balance.available - applyWithdrawOrder.targetAmount,
      locked: balance.locked + applyWithdrawOrder.targetAmount,
      createTimestamp: getTimestamp(),
    },
    nodeSignature: nodeSignature,
  };
  return accpetedWithdrawOrder;
};
