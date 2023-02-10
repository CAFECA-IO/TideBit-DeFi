import {ITransferOrder} from './transfer_order';

export interface IDepositOrder extends ITransferOrder {
  type: 'deposit';
}

export const dummyDepositOrder: IDepositOrder = {
  type: 'deposit',
  asset: 'USDT',
  amount: 2000,
};
