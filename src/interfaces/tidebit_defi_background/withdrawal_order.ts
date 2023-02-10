import {IOrder} from './order';

export interface IWithdrawalOrder extends IOrder {
  type: 'WITHDRAW';
}

export const dummyWithdrawalOrder: IWithdrawalOrder = {
  timestamp: 1675299651,
  type: 'WITHDRAW',
  asset: 'USDT',
  amount: 15,
};
