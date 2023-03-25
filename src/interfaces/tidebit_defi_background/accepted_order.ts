import {IOrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType} from '../../constants/order_type';

export interface IAcceptedOrder {
  id: string;
  txid: string;
  orderType: IOrderType;
  createTimestamp: number;
  orderStatus: IOrderStatusUnion;
  fee: number;
  remark?: string;
}
