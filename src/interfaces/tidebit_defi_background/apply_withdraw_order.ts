import {IOrderType, OrderType} from '../../constants/order_type';
import {IApplyOrder} from './apply_order';

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
  createTimestamp: Math.ceil(Date.now() / 1000),
  targetAsset: 'USDT',
  targetAmount: 1,
  to: '0x',
  remark: '',
  // decimals: 18,
  fee: 0,
};
