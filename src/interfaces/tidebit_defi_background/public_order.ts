import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';

export interface IPublicOrder {
  id: string;
  orderType: IOrderType;
  orderStatus: IOrderStatusUnion;
}

export interface IPublicCFDOrder extends IPublicOrder {
  ticker: string;
  price: number;
  triggerPrice: number;
  typeOfPosition: ITypeOfPosition;
  leverage: number;
  margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  estimatedFilledPrice: number;
  fee: number;
  targetUnit: string;
  chargeUnit: string;
  remark?: string;
}

export interface IPublicSpotOrder extends IPublicOrder {
  ticker: string;
  fromCurrency: string;
  toCurrency: string;
  price: number;
  amount: number;
  averageFilledPrice: number;
  filledAmount: number;
  typeOfPosition: ITypeOfPosition;
  tradeCounts: number;
}

export interface IPublicDepositOrder extends IPublicOrder {
  currency: string;
  amount: number;
  from: string;
  to: string;
}

export interface IPublicWithdrawOrder extends IPublicOrder {
  currency: string;
  amount: number;
  from: string;
  to: string;
}

export const dummyPublicCFDOrder: IPublicCFDOrder = {
  id: '001',
  orderType: OrderType.CFD,
  orderStatus: OrderStatusUnion.PROCESSING,
  ticker: 'ETH',
  price: 20193.1,
  triggerPrice: 20193.1,
  typeOfPosition: TypeOfPosition.SELL,
  leverage: 5,
  margin: 1,
  guranteedStop: true,
  estimatedFilledPrice: 1,
  fee: 0.0001,
  targetUnit: 'ETH',
  chargeUnit: 'USDT',
};

export const dummyPublicDepositOrder: IPublicDepositOrder = {
  id: '001',
  orderType: OrderType.DEPOSIT,
  orderStatus: OrderStatusUnion.SUCCESS,
  currency: 'ETH',
  amount: 7.91,
  from: '0x',
  to: '0x',
};

export const dummyPublicWithdrawOrder: IPublicWithdrawOrder = {
  id: '001',
  orderType: OrderType.WITHDRAW,
  orderStatus: OrderStatusUnion.FAILED,
  currency: 'ETH',
  amount: 1,
  from: '0x',
  to: '0x',
};
