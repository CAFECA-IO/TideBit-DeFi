import {IBalance} from './balance';
import {ICFDOrder, IDepositOrder, IOrder, IWithdrawOrder} from './order';

export interface IReceipt {
  order: IOrder;
  balance: IBalance;
  /**
   *  Info: IMPORTANT!!! this balance.available is balance.available after order (20230412 - tzuhan)
   *  Info: IMPORTANT!!! this balance.locked is balance.locked after order (20230412 - tzuhan)
   * */
}

export interface ICFDReceipt extends IReceipt {
  order: ICFDOrder;
}

export interface IDepositReceipt extends IReceipt {
  order: IDepositOrder;
}

export interface IWithdrawReceipt extends IReceipt {
  order: IWithdrawOrder;
}
