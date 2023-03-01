import {ICFDOrderType} from '../../constants/cfd_order_type';
import {ITypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';

export interface IAcceptedCFDOrder {
  id: string;
  type: ICFDOrderType;
  ticker: string;
  typeOfPosition: ITypeOfPosition;
  price: number;
  amount: number;
  targetAsset: string;
  uniAsset: string;
  createTimestamp?: number;
  leverage: number;
  margin: IMargin;
  takeProfit?: number;
  stopLoss?: number;
  fee?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
  liquidationPrice: number;
  closePrice: number;
  closeTimestamp?: number;
}
