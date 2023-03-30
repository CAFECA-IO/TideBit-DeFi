import {IAcceptedOrder} from './accepted_order';
import {IApplyDepositOrder} from './apply_deposit_order';
import {IDepositOrderSnapshot} from './order_snapshot';

export interface IAcceptedDepositOrder extends IAcceptedOrder {
  applyData: IApplyDepositOrder;
  orderSnapshot: IDepositOrderSnapshot;
}

/* TODO: dummyAcceptedDepositrder (20230330 - tzuhan)
export const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
  id: '001',
  txid: '0x',
  orderType: OrderType.DEPOSIT,
  createTimestamp: Math.ceil(Date.now() / 1000),
  orderStatus: OrderStatusUnion.SUCCESS,
  targetAsset: 'ETH',
  decimals: 18,
  targetAmount: 7.91,
  to: '0x',
  fee: 0,
};

export const getDummyAcceptedDepositOrder = (currency = 'ETH'): IAcceptedDepositOrder => {
  const date = new Date();
  const dummyAcceptedDepositOrder: IAcceptedDepositOrder = {
    id: `TBAcceptedDeposit${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getSeconds()}${currency}`,
    txid: randomHex(32),
    orderType: OrderType.DEPOSIT,
    createTimestamp: getTimestamp(),
    orderStatus: OrderStatusUnion.SUCCESS,
    targetAsset: currency,
    decimals: 18,
    targetAmount: 7.91,
    to: '0x',
    fee: 0,
  };
  return dummyAcceptedDepositOrder;
};
*/
