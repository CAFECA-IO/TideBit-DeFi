import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  currency: string;
  amount: number;
  from: string;
}

export const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
  id: '001',
  orderType: OrderType.DEPOSIT,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  currency: 'ETH',
  amount: 7.91,
  from: '0x',
};
