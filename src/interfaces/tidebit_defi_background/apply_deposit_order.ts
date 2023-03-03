import {OrderType, IOrderType} from '../../constants/order_type';
import {IApplyOrder} from './apply_order';

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
  createTimestamp: Math.ceil(Date.now() / 1000),
  targetAsset: 'ETH',
  targetAmount: 2,
  decimals: 18,
  to: '0x',
  remark: '',
  fee: 0,
};
