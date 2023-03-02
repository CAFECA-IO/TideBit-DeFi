import {IApplyOrder} from './apply_order';

export interface IApplyWithdrawOrder extends IApplyOrder {
  currency: string;
  amount: number;
  to: string;
}
