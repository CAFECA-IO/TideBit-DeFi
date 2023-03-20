import {IOrderState, OrderState} from '../../constants/order_state';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';
import {IBalance} from './balance';

/** extended by
 * @interface IWithdrawalOrder
 * @interface IDepositOrder
 * @interface IOpenCFDOrder
 * @interface IClosedCFDOrder [TODO: closed_cfd_order.ts]
 */
export interface IOrder {
  // address: string;
  timestamp: number;
  type: IOrderType;
  targetAsset: string;
  targetAmount: number;
  remarks?: string; // 備註,
  balanceSnapshot: IBalance;
  orderSnapshot: {
    id: string;
    txid?: string;
    status: IOrderStatusUnion;
    state?: IOrderState;
    detail: string;
    fee: number; // 手續費
  };
}

export const dummyDepositOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.DEPOSIT,
  targetAsset: 'USDT',
  targetAmount: 2000,
  remarks: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 2000,
    locked: 0,
  },
  orderSnapshot: {
    id: 'TBDDeposit20230320_001',
    txid: '0x',
    status: OrderStatusUnion.PROCESSING,
    detail: '',
    fee: 0,
  },
};
export const dummyWithdrawalOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.WITHDRAW,
  targetAsset: 'USDT',
  targetAmount: 15,
  balanceSnapshot: {
    currency: 'USDT',
    available: 1985,
    locked: 0,
  },
  orderSnapshot: {
    id: 'TBDWithdraw20230320_001',
    txid: '0x',
    status: OrderStatusUnion.PROCESSING,
    detail: '',
    fee: 0,
  },
};

// TODO: convert IAcceptedCFDOrder to IOrder after PR#324 is merged (20230320 - tzuhan)
export const dummyOpenCFDOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: 1,
  remarks: '',
  balanceSnapshot: {
    currency: 'ETH',
    available: 19.2,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDCFD20230320_001',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    state: OrderState.OPENING,
    detail: '',
    fee: 0,
  },
};

export const dummyClosedCFDOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: 1,
  remarks: '',
  balanceSnapshot: {
    currency: 'ETH',
    available: 19.2,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDCFD20230320_002',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    state: OrderState.CLOSED,
    detail: '',
    fee: 0,
  },
};
