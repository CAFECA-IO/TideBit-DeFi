import {ITypeOfPosition, TypeOfPosition} from '../../constants/type_of_position';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';

export interface IPublicOrder {
  id: string;
  orderType: IOrderType;
  orderStatus: IOrderStatusUnion;
  createdTime?: number;
}

export interface IPublicCFDOrder extends IPublicOrder {
  ticker: string;
  price: number;
  amount: number;
  liquidationPrice: number;
  typeOfPosition: ITypeOfPosition;
  leverage: number;
  margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
  fee: number;
  targetUnit: string;
  chargeUnit: string;
  marginUnit: string;
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
  amount: 7.91,
  liquidationPrice: 20193.1,
  typeOfPosition: TypeOfPosition.SELL,
  leverage: 5,
  margin: 1,
  guaranteedStop: true,
  fee: 0.0001,
  targetUnit: 'ETH',
  chargeUnit: 'USDT',
  marginUnit: 'USDT',
  createdTime: 1676369333495,
};

export const dummyPublicDepositOrder: IPublicDepositOrder = {
  id: '001',
  orderType: OrderType.DEPOSIT,
  orderStatus: OrderStatusUnion.SUCCESS,
  currency: 'ETH',
  amount: 7.91,
  from: '0x',
  to: '0x',
  createdTime: 1676369333495,
};

export const dummyPublicWithdrawOrder: IPublicWithdrawOrder = {
  id: '001',
  orderType: OrderType.WITHDRAW,
  orderStatus: OrderStatusUnion.FAILED,
  currency: 'ETH',
  amount: 1,
  from: '0x',
  to: '0x',
  createdTime: 1676369333495,
};
