import {IOrder} from './order';

export interface IDepositOrder extends IOrder {
  type: 'DEPOSIT';
}

export const dummyDepositOrder: IDepositOrder = {
  timestamp: 1675299651,
  type: 'DEPOSIT',
  asset: 'USDT',
  amount: 2000,
  remarks: 'sth',
};
