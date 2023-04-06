import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType, IOrderType} from '../../constants/order_type';
import {getTimestamp} from '../../lib/common';
import {IAcceptedDepositOrder} from './accepted_deposit_order';
import {IApplyOrder} from './apply_order';
import {IBalance} from './balance';

export interface IApplyDepositOrder extends IApplyOrder {
  orderType: IOrderType;
  createTimestamp?: number;
  targetAmount: number;
  targetAsset: string; // ++ TODO: this would be IDepositCrytoCurrency property
  decimals: number; // ++ TODO: this would be IDepositCrytoCurrency property
  to: string; // ++ TODO: this would be IDepositCrytoCurrency property
  remark: string;
  fee: number;
}

export const dummyDepositOrder: IApplyDepositOrder = {
  orderType: OrderType.DEPOSIT,
  createTimestamp: getTimestamp(),
  targetAsset: 'ETH',
  targetAmount: 2,
  decimals: 18,
  to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  remark: '',
  fee: 0,
};

export const convertApplyDepositOrderToAcceptedDepositOrder = (
  applyDepositOrder: IApplyDepositOrder,
  balance: IBalance,
  txid: string,
  nodeSignature: string
) => {
  const date = new Date();
  const id = `${OrderType.DEPOSIT}${date.getTime()}${applyDepositOrder.targetAsset}${Math.ceil(
    Math.random() * 1000000000
  )}`;
  const accpetedDepositOrder: IAcceptedDepositOrder = {
    ...applyDepositOrder,
    id,
    orderStatus: OrderStatusUnion.WAITING,
    createTimestamp: applyDepositOrder.createTimestamp
      ? applyDepositOrder.createTimestamp
      : getTimestamp(),
    applyData: applyDepositOrder,
    orderSnapshot: {...applyDepositOrder, txid, id},
    userSignature: '',
    balanceDifferenceCauseByOrder: {
      currency: applyDepositOrder.targetAsset,
      available: 0,
      locked: applyDepositOrder.targetAmount,
    },
    balanceSnapshot: {
      currency: applyDepositOrder.targetAsset,
      available: balance.available,
      locked: balance.locked + applyDepositOrder.targetAmount,
      createTimestamp: getTimestamp(),
    },
    nodeSignature: nodeSignature,
  };
  return accpetedDepositOrder;
};
