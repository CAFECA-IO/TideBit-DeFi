import {ITransferOrder} from './transfer_order';

export interface IWithdrawalOrder extends ITransferOrder {
  type: 'withdrawal';
}

export const dummyWithdrawalOrder: IWithdrawalOrder = {
  type: 'withdrawal',
  asset: 'USDT',
  amount: 15,
};
