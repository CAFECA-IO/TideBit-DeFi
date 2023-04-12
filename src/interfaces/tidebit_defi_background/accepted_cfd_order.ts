import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {
  convertApplyCloseCFDToAcceptedCFD,
  convertApplyCreateCFDToAcceptedCFD,
  convertApplyUpdateCFDToAcceptedCFD,
  IApplyCFDOrder,
} from './apply_cfd_order';
import {getDummyApplyCloseCFDOrder, IApplyCloseCFDOrder} from './apply_close_cfd_order';
import {getDummyApplyCreateCFDOrder, IApplyCreateCFDOrder} from './apply_create_cfd_order';
import {getDummyApplyUpdateCFDOrder, IApplyUpdateCFDOrder} from './apply_update_cfd_order';
import {IBalance} from './balance';
import {ICFDReceipt} from './receipt';

export interface IAcceptedCFDOrder extends IAcceptedOrder {
  applyData: IApplyCFDOrder;
  receipt: ICFDReceipt;
}

export const getDummyAcceptedCreateCFDOrder = (
  currency = 'ETH',
  orderStatus?: IOrderStatusUnion
) => {
  const applyCreateCFDOrder: IApplyCreateCFDOrder = getDummyApplyCreateCFDOrder(currency);
  const dummyBalance = {
    currency: currency,
    available: applyCreateCFDOrder.amount * 1.5,
    locked: 0,
  };
  const dummyUserSignature = randomHex(32);
  const dummyNodeSignature = randomHex(32);
  const {acceptedCFDOrder} = convertApplyCreateCFDToAcceptedCFD(
    applyCreateCFDOrder,
    dummyBalance,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return acceptedCFDOrder;
};

export const getDummyAcceptedUpdateCFDOrder = (
  currency = 'ETH',
  orderStatus?: IOrderStatusUnion
) => {
  const accpetedCreateCFDOrder: IAcceptedCFDOrder = getDummyAcceptedCreateCFDOrder(
    currency,
    OrderStatusUnion.SUCCESS
  );
  const applyUpdateCFDOrder: IApplyUpdateCFDOrder = getDummyApplyUpdateCFDOrder(
    currency,
    accpetedCreateCFDOrder.receipt.order.id
  );
  const dummyBalance = accpetedCreateCFDOrder.receipt.balance;
  const dummyUserSignature = randomHex(32);
  const dummyNodeSignature = randomHex(32);
  const {acceptedCFDOrder} = convertApplyUpdateCFDToAcceptedCFD(
    applyUpdateCFDOrder,
    accpetedCreateCFDOrder.receipt.order,
    dummyBalance,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return [accpetedCreateCFDOrder, acceptedCFDOrder];
};

export const getDummyAcceptedCloseCFDOrder = (
  currency = 'ETH',
  orderStatus?: IOrderStatusUnion
) => {
  const accpetedCreateCFDOrder: IAcceptedCFDOrder = getDummyAcceptedCreateCFDOrder(
    currency,
    OrderStatusUnion.SUCCESS
  );
  const applyCloseCFDOrder: IApplyCloseCFDOrder = getDummyApplyCloseCFDOrder(
    currency,
    accpetedCreateCFDOrder.receipt.order.id
  );
  const dummyBalance = accpetedCreateCFDOrder.receipt.balance;
  const dummyUserSignature = randomHex(32);
  const dummyNodeSignature = randomHex(32);
  const {acceptedCFDOrder} = convertApplyCloseCFDToAcceptedCFD(
    applyCloseCFDOrder,
    accpetedCreateCFDOrder.receipt.order,
    dummyBalance,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return [accpetedCreateCFDOrder, acceptedCFDOrder];
};

export const dummyAcceptedCFDOrders: IAcceptedCFDOrder[] = [
  getDummyAcceptedCreateCFDOrder('ETH', OrderStatusUnion.PROCESSING),
  getDummyAcceptedCreateCFDOrder('ETH', OrderStatusUnion.FAILED),
  ...getDummyAcceptedUpdateCFDOrder('ETH'),
  ...getDummyAcceptedUpdateCFDOrder('ETH', OrderStatusUnion.FAILED),
  ...getDummyAcceptedCloseCFDOrder('ETH'),
  ...getDummyAcceptedCloseCFDOrder('ETH', OrderStatusUnion.FAILED),
];
