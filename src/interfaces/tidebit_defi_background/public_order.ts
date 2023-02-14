import {IOrderStatusUnion} from './order_status_union';

export type IOrderType = 'CFD' | 'DEPOSIT' | 'WITHDRAW' | 'SPOT';

export interface IPublicOrder {
  id: string;
  orderType: IOrderType;
  orderStatus: IOrderStatusUnion;
}

export interface IPublicCFDOrder extends IPublicOrder {
  ticker: string;
  price: number;
  triggerPrice: number;
  typeOfPosition: 'BUY' | 'SELL';
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
  typeOfPosition: 'BUY' | 'SELL';
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
  orderType: 'CFD',
  orderStatus: 'PROCESSING',
  ticker: 'ETH',
  price: 20193.1,
  triggerPrice: 20193.1,
  typeOfPosition: 'SELL',
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
  orderType: 'DEPOSIT',
  orderStatus: 'SUCCESS',
  currency: 'ETH',
  amount: 7.91,
  from: '0x',
  to: '0x',
};

export const dummyPublicWithdrawOrder: IPublicWithdrawOrder = {
  id: '001',
  orderType: 'WITHDRAW',
  orderStatus: 'FAILED',
  currency: 'ETH',
  amount: 1,
  from: '0x',
  to: '0x',
};
