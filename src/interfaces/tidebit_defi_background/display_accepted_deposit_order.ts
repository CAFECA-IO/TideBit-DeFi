import {OrderStatusUnion} from '../../constants/order_status_union';
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
