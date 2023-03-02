import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  currency: string;
  amount: number;
  to: string;
}

export const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
  id: '001',
  orderType: OrderType.WITHDRAW,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  currency: 'ETH',
  amount: 7.91,
  to: '0x',
};
