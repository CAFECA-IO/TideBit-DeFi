import {IAcceptedDepositOrder} from './accepted_deposit_order';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';

export interface IDisplayAcceptedDepositOrder extends IAcceptedDepositOrder {
  available: number;
}

export const toDisplayAcceptedDepositOrder = (acceptedDepositOrder: IAcceptedDepositOrder) => {
  const available = 2000;

  const displayAcceptedDepositOrder: IDisplayAcceptedDepositOrder = {
    ...acceptedDepositOrder,
    available: available,
  };
  return displayAcceptedDepositOrder;
};

export const getDummyDisplayAcceptedDepositOrder = (currency: string) => {
  const dummyDisplayAcceptedDepositOrder: IDisplayAcceptedDepositOrder = {
    id: 'TBD202303280000001',
    txid: '0x',
    orderType: OrderType.DEPOSIT,
    createTimestamp: 1679932800,
    orderStatus:
      Math.random() > 0.5
        ? OrderStatusUnion.SUCCESS
        : Math.random() === 0.5
        ? OrderStatusUnion.PROCESSING
        : OrderStatusUnion.FAILED,
    fee: 0,
    remark: '',
    targetAsset: currency,
    targetAmount: 20,
    decimals: 18,
    to: '0x',
    available: 2000,
  };
  return dummyDisplayAcceptedDepositOrder;
};
