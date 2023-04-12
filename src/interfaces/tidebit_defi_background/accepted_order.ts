import {dummyAcceptedCFDOrders} from './accepted_cfd_order';
import {dummyAcceptedDepositOrders} from './accepted_deposit_order';
import {dummyAcceptedWithdrawrders} from './accepted_withdraw_order';
import {IApplyOrder} from './apply_order';
import {IReceipt} from './receipt';

export interface IAcceptedOrder {
  txid: string;
  applyData: IApplyOrder; // Info: including orderType (20230412 - tzuhan)
  userSignature: string;
  receipt: IReceipt; // Info: including order and orderStatus, targetAsset and targetAmount is inside of order (20230412 - tzuhan)
  nodeSignature: string;
  createTimestamp: number;
}

export const dummyAcceptedOrders: IAcceptedOrder[] = [
  ...dummyAcceptedDepositOrders,
  ...dummyAcceptedCFDOrders,
  ...dummyAcceptedWithdrawrders,
];
