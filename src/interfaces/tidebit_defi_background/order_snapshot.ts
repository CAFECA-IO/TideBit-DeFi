import {ICFDClosedType} from '../../constants/cfd_closed_type';
import {IOrderState} from '../../constants/order_state';
import {IOrderType} from '../../constants/order_type';
import {ITypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';

export interface IOrderSnapshot {
  id: string;
  orderType: IOrderType;
  txid: string;
  fee: number;
  remark?: string;
}

export interface ICFDOrderSnapshot extends IOrderSnapshot {
  referenceId: string;
  ticker: string;
  state: IOrderState;
  orderType: IOrderType;

  openPrice: number;
  createTimestamp: number;
  typeOfPosition: ITypeOfPosition;
  targetAsset: string;
  unitAsset: string;
  amount: number;
  leverage: number;
  margin: IMargin;
  guaranteedStop: boolean;
  liquidationPrice: number;
  liquidationTime: number;

  takeProfit?: number;
  stopLoss?: number;
  guaranteedStopFee?: number;

  closePrice?: number;
  closeTimestamp?: number;
  closedType?: ICFDClosedType;
  forcedClose?: boolean;
  pnl?: number;
}

export interface IDepositOrderSnapshot extends IOrderSnapshot {
  targetAsset: string;
  targetAmount: number;
  decimals: number;
  to: string;
}

export interface IWithdrawOrderSnapshot extends IOrderSnapshot {
  targetAsset: string;
  targetAmount: number;
  to: string;
}
