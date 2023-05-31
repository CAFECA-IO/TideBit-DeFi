import {IBalance} from './balance';
import {ICFDOrder, IDepositOrder, IOrder, IWithdrawOrder} from './order';

export interface IReceipt {
  txhash: string;
  sequence: number;
  balanceSnapshot: IBalance[];
  orderSnapshot: IOrder;
}

export interface ICFDReceipt extends IReceipt {
  orderSnapshot: ICFDOrder;
}

export interface IDepositReceipt extends IReceipt {
  orderSnapshot: IDepositOrder;
}

export interface IWithdrawReceipt extends IReceipt {
  orderSnapshot: IWithdrawOrder;
}
