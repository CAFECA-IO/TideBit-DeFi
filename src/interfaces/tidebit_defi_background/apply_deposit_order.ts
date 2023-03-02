import {IApplyOrder} from './apply_order';

export interface IApplyDepositOrder extends IApplyOrder {
  currency: string;
  amount: number;
  from: string;
}
