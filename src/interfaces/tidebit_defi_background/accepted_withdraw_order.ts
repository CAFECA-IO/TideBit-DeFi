import {IAcceptedOrder} from './accepted_order';
import {IApplyWithdrawOrder} from './apply_withdraw_order';
import {IWithdrawOrderSnapshot} from './order_snapshot';

export interface IAcceptedWithdrawOrder extends IAcceptedOrder {
  applyData: IApplyWithdrawOrder;
  orderSnapshot: IWithdrawOrderSnapshot;
}

/* TODO: dummyAcceptedWithdrawrder (20230330 - tzuhan)
export const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
  id: '001',
  txid: '0x',
  orderType: OrderType.WITHDRAW,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  targetAmount: 7.91,
  to: '0x',
  // decimals: 18,
  fee: 0,
};

export const getDummyAcceptedWithdrawOrder = (currency = 'ETH'): IAcceptedWithdrawOrder => {
  const date = new Date();
  const dummyAcceptedWithdrawOrder: IAcceptedWithdrawOrder = {
    id: `TBAcceptedWithdraw${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    txid: randomHex(32),
    orderType: OrderType.WITHDRAW,
    createTimestamp: getTimestamp(),
    orderStatus: OrderStatusUnion.SUCCESS,
    targetAsset: currency,
    targetAmount: 7.91,
    to: '0x',
    // decimals: 18,
    fee: 0,
  };
  return dummyAcceptedWithdrawOrder;
};
*/
