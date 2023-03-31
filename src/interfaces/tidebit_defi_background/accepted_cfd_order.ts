import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {randomHex} from '../../lib/common';
import {IAcceptedOrder} from './accepted_order';
import {
  convertApplyCloseCFDToAcceptedCFD,
  convertApplyCreateCFDToAcceptedCFD,
  convertApplyUpdateCFDToAcceptedCFD,
  IApplyCFDOrder,
} from './apply_cfd_order';
import {getDummyApplyCloseCFDOrder, IApplyCloseCFDOrder} from './apply_close_cfd_order_data';
import {getDummyApplyCreateCFDOrder, IApplyCreateCFDOrder} from './apply_create_cfd_order_data';
import {getDummyApplyUpdateCFDOrder, IApplyUpdateCFDOrder} from './apply_update_cfd_order_data';
import {IBalance} from './balance';
import {ICFDOrderSnapshot} from './order_snapshot';

export interface IAcceptedCFDOrder extends IAcceptedOrder {
  display: boolean;
  applyData: IApplyCFDOrder;
  orderSnapshot: ICFDOrderSnapshot;
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
  const acceptedCreateCFDOrder = convertApplyCreateCFDToAcceptedCFD(
    applyCreateCFDOrder,
    dummyBalance,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return acceptedCreateCFDOrder;
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
    accpetedCreateCFDOrder.id
  );
  const dummyUserSignature = randomHex(32);
  const dummyNodeSignature = randomHex(32);
  const acceptedUpdateCFDOrder = convertApplyUpdateCFDToAcceptedCFD(
    applyUpdateCFDOrder,
    accpetedCreateCFDOrder,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return [accpetedCreateCFDOrder, acceptedUpdateCFDOrder];
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
    accpetedCreateCFDOrder.id
  );
  const dummyBalance = accpetedCreateCFDOrder.balanceSnapshot as IBalance;
  const dummyUserSignature = randomHex(32);
  const dummyNodeSignature = randomHex(32);
  const acceptedCloseCFDOrder = convertApplyCloseCFDToAcceptedCFD(
    applyCloseCFDOrder,
    accpetedCreateCFDOrder,
    dummyBalance,
    dummyUserSignature,
    dummyNodeSignature,
    orderStatus
  );
  return [accpetedCreateCFDOrder, acceptedCloseCFDOrder];
};

export const dummyAcceptedCFDOrders: IAcceptedCFDOrder[] = [
  getDummyAcceptedCreateCFDOrder('ETH', OrderStatusUnion.PROCESSING),
  getDummyAcceptedCreateCFDOrder('ETH', OrderStatusUnion.FAILED),
  ...getDummyAcceptedUpdateCFDOrder('ETH'),
  ...getDummyAcceptedUpdateCFDOrder('ETH', OrderStatusUnion.FAILED),
  ...getDummyAcceptedCloseCFDOrder('ETH'),
  ...getDummyAcceptedCloseCFDOrder('ETH', OrderStatusUnion.FAILED),
];
