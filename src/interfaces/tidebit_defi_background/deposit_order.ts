import {IOrder} from './order';

export interface IDepositOrder extends IOrder {
  type: 'DEPOSIT';
}

export const dummyDepositOrder: IDepositOrder = {
  timestamp: 1675299651,
  type: 'DEPOSIT',
  targetAsset: 'USDT',
  targetAmount: 2000,
  remarks: 'sth',
  fee: 0,
};
