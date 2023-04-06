import {IAcceptedDepositOrder} from './accepted_deposit_order';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {IBalance} from './balance';

export interface IDisplayAcceptedDepositOrder {
  balanceSnapshot: IBalance;
}

export const getDummyDisplayAcceptedDepositOrder = (currency: string) => {
  const orderStatus =
    Math.random() > 0.5
      ? OrderStatusUnion.SUCCESS
      : Math.random() === 0.5
      ? OrderStatusUnion.PROCESSING
      : OrderStatusUnion.FAILED;
  const dummyDisplayAcceptedDepositOrder: IDisplayAcceptedDepositOrder = {
    // id: 'TBD202303280000001',
    // txid: '0x',
    // orderType: OrderType.DEPOSIT,
    // createTimestamp: 1679932800,
    // orderStatus,
    // fee: 0,
    // remark: '',
    // targetAsset: currency,
    // targetAmount: 20,
    // decimals: 18,
    // to: '0x',
    balanceSnapshot: {
      currency,
      available: 2000 + orderStatus === OrderStatusUnion.SUCCESS ? 20 : 0,
      locked:
        orderStatus === OrderStatusUnion.PROCESSING || orderStatus === OrderStatusUnion.WAITING
          ? 20
          : 0,
    },
  };
  return dummyDisplayAcceptedDepositOrder;
};
