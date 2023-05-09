import {IOrderType} from '../../constants/order_type';
import {dummyAcceptedCFDOrders} from './accepted_cfd_order';
import {dummyAcceptedDepositOrders} from './accepted_deposit_order';
import {dummyAcceptedWithdrawrders} from './accepted_withdraw_order';
import {IApplyOrder} from './apply_order';
import {IReceipt} from './receipt';

export interface IAcceptedOrder {
  id: string;
  orderType: IOrderType;
  sequence: number;
  txhash: string;
  applyData: IApplyOrder;
  receipt: IReceipt;
  userSignature: string;
  droneSignature: string;
  locutusSignature: string;
  createTimestamp: number;
}

export const dummyAcceptedOrders: IAcceptedOrder[] = [
  ...dummyAcceptedDepositOrders,
  ...dummyAcceptedCFDOrders,
  ...dummyAcceptedWithdrawrders,
];
