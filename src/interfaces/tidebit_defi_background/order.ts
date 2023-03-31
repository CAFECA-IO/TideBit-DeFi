import {IOrderState, OrderState} from '../../constants/order_state';
import {IOrderStatusUnion, OrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType, OrderType} from '../../constants/order_type';
import {IBalance} from './balance';

/** extended by
 * @interface IWithdrawalOrder
 * @interface IDepositOrder
 * @interface IOpenCFDOrder
 * @interface IClosedCFDOrder
 */
export interface IOrder {
  // address: string;
  timestamp: number;
  type: IOrderType;
  targetAsset: string;
  targetAmount: number;
  detail: string;
  balanceSnapshot: IBalance;
  orderSnapshot: {
    id: string;
    txid: string;
    status: IOrderStatusUnion;
    state?: IOrderState;
    fee: number; // 手續費
    to?: string;
    decimals?: number;
    remarks?: string; // 備註,
  };
}

export const dummyDepositOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.DEPOSIT,
  targetAsset: 'USDT',
  targetAmount: 2000,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 2000,
    locked: 0,
  },
  orderSnapshot: {
    id: 'TBDDeposit20230320_001',
    txid: '0x',
    status: OrderStatusUnion.PROCESSING,
    remarks: '',
    fee: 0,
  },
};
export const dummyWithdrawalOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.WITHDRAW,
  targetAsset: 'USDT',
  targetAmount: -15,
  balanceSnapshot: {
    currency: 'USDT',
    available: 1985,
    locked: 0,
  },
  detail: '',
  orderSnapshot: {
    id: 'TBDWithdraw20230320_001',
    txid: '0x',
    status: OrderStatusUnion.PROCESSING,
    remarks: '',
    fee: 0,
  },
};

export const dummyOpenCFDOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: -1,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 1999,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDCFD20230320_001',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    state: OrderState.OPENING,
    remarks: '',
    fee: 0,
  },
};

export const dummyClosedCFDOrder: IOrder = {
  timestamp: 1675299651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: 0,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 1998,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDCFD20230320_002',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    state: OrderState.CLOSED,
    remarks: '',
    fee: 0,
  },
};

/* Info: (20230331 - Julian) dummy data for test */
export const dummyDepositOrder2: IOrder = {
  timestamp: 1679587700,
  type: OrderType.DEPOSIT,
  targetAsset: 'ETH',
  targetAmount: 80,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 2308,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDDeposit20230324_002',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    remarks: '',
    fee: 0,
  },
};

export const dummyWithdrawalOrder2: IOrder = {
  timestamp: 1679587200,
  type: OrderType.WITHDRAW,
  targetAsset: 'ETH',
  targetAmount: -10,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 1979,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBDWithdraw20230324_002',
    txid: '0x',
    status: OrderStatusUnion.SUCCESS,
    remarks: '',
    fee: -0.05,
  },
};

export const dummyOpenCFDOrder2: IOrder = {
  timestamp: 1673299651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: -5,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 1999,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBD202303240000001',
    txid: '0x',
    status: OrderStatusUnion.FAILED,
    state: OrderState.OPENING,
    remarks: '',
    fee: 0,
  },
};

export const dummyClosedCFDOrder2: IOrder = {
  timestamp: 1679999651,
  type: OrderType.CFD,
  targetAsset: 'ETH',
  targetAmount: +30,
  detail: '',
  balanceSnapshot: {
    currency: 'USDT',
    available: 1998,
    locked: 1,
  },
  orderSnapshot: {
    id: 'TBD202303240000001',
    txid: '0x',
    status: OrderStatusUnion.FAILED,
    state: OrderState.CLOSED,
    remarks: '',
    fee: 0,
  },
};
