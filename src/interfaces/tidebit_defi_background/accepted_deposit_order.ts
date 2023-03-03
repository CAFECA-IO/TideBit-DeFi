import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {IAcceptedOrder} from './accepted_order';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  targetAsset: string;
  targetAmount: number;
  decimals: number;
  to: string;
  remark?: string;
  fee: number;
}

export const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
  id: '001',
  orderType: OrderType.DEPOSIT,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  decimals: 18,
  targetAmount: 7.91,
  to: '0x',
  fee: 0,
};
