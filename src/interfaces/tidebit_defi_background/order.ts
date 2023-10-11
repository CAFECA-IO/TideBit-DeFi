import {ICurrency} from '../../constants/currency';
import {ICFDClosedType} from '../../constants/cfd_closed_type';
import {IOrderState} from '../../constants/order_state';
import {IOrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType} from '../../constants/order_type';
import {ITypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';
import {IPnL} from './pnl';

export interface IOrder {
  id: string;
  orderType: IOrderType;
  orderStatus: IOrderStatusUnion;
  txhash: string;
  fee: number;
  createTimestamp: number;
  updatedTimestamp: number;
  remark?: string;
}

export interface ICFDOrder extends IOrder {
  instId: string;
  // fee: number;
  state: IOrderState;
  openPrice: number;
  openSpotPrice: number;
  openSpreadFee: number;
  typeOfPosition: ITypeOfPosition;
  targetAsset: ICurrency;
  unitAsset: string;
  amount: number;
  leverage: number;
  margin: IMargin; // Info: UI MyAsset Histories 對應 CFD order 的 金額變化及變化的 currency 是對應 margin 裡面的 asset 及 amont 而不是 targetAsset 及 targetAmount (20230412 - tzuhan)
  guaranteedStop: boolean;
  liquidationPrice: number;
  liquidationTime: number;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStopFee?: number;
  closePrice?: number;
  closeSpotPrice?: number;
  closeSpreadFee?: number;
  closeTimestamp?: number;
  closedType?: ICFDClosedType;
  forcedClose?: boolean;
  pnl?: IPnL;
}

export interface IDepositOrder extends IOrder {
  txhash: string; // txhash on BOLT
  targetAsset: string;
  targetAmount: number;
  ethereumTxHash: string;
}

export interface IWithdrawOrder extends IOrder {
  txhash: string; // txhash on BOLT
  targetAsset: string;
  targetAmount: number;
  // fee: number;
}
