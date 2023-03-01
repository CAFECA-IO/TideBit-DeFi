import {ICFDClosedType} from '../../constants/cfd_closed_type';
import {ICFDOrderType} from '../../constants/cfd_order_type';
import {IOrderState} from '../../constants/order_state';
import {ITypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';

export interface IAcceptedCFDOrder {
  id: string;
  type: ICFDOrderType;
  ticker: string;
  typeOfPosition: ITypeOfPosition;
  openPrice: number;
  amount: number;
  targetAsset: string;
  uniAsset: string;
  createTimestamp?: number;
  leverage: number;
  margin: IMargin;
  takeProfit?: number;
  stopLoss?: number;
  fee: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
  liquidationPrice: number;
  closePrice: number;
  closeTimestamp?: number;
  state: IOrderState;
  liquidationTime: number;
  closedType?: ICFDClosedType;
  forcedClose?: boolean;
  remark?: string;
}
