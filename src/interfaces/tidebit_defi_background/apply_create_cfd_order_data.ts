import {ITypeOfPosition} from '../../constants/type_of_position';
import {IMargin} from './margin';
import {IQuotation} from './quotation';

export interface IApplyCreateCFDOrderData {
  ticker: string;
  typeOfPosition: ITypeOfPosition;
  price: number;
  quotation: IQuotation; // 報價單
  amount: number;
  targetAsset: string;
  uniAsset: string; // 計價單位
  createTimestamp?: number;
  leverage: number;
  margin: IMargin;
  takeProfit?: number;
  stopLoss?: number;
  fee?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
  liquidationPrice: number; // 強制平倉價格
  liquidationTime: number;
  remark: string;
}
