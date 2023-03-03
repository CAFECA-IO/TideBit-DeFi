import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  targetAsset: string;
  targetAmount: number;
  decimals: number;
  to: string;
  remark?: string;
  fee: number;
}

export const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
  id: '001',
  orderType: OrderType.WITHDRAW,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  targetAmount: 7.91,
  to: '0x',
  decimals: 18,
  fee: 0,
};
