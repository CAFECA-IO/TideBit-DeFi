import {IOrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType} from '../../constants/order_type';

export interface IAcceptedOrder {
  id: string;
  orderType: IOrderType;
  createTimestamp: number;
  orderStatus: IOrderStatusUnion;
}
