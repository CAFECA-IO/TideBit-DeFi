import {IOrderStatusUnion} from '../../constants/order_status_union';
import {IOrderType} from '../../constants/order_type';
import {IApplyOrder} from './apply_order';
import {IBalance} from './balance';
import {IOrderSnapshot} from './order_snapshot';

export interface IBalanceSnapshot extends IBalance {
  createTimestamp: number;
}

// export interface IReceipt {
//   balanceDifferenceCauseByOrder: IBalance;
//   balanceSnapshot: IBalanceSnapshot; //updated balance after order created,
//   orderSnapshot: IOrderSnapshot;
// }

export interface IAcceptedOrder {
  id: string;
  orderType: IOrderType;
  orderStatus: IOrderStatusUnion;
  targetAsset: string; // will equal to receiptData.balanceDifferenceCauseByOrder.currency
  targetAmount: number; // will equal to receiptData.balanceDifferenceCauseByOrder.available
  applyData: IApplyOrder;
  userSignature: string;

  // receiptData: IReceipt;
  balanceDifferenceCauseByOrder: IBalance;
  balanceSnapshot: IBalanceSnapshot; //updated balance after order created,
  orderSnapshot: IOrderSnapshot;
  nodeSignature: string;

  createTimestamp: number;
  // updateTimestamp: number;
}
