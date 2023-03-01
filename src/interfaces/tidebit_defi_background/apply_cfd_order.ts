import {ICFDOrderType} from '../../constants/cfd_order_type';
import {IApplyCloseCFDOrderData} from './apply_close_cfd_order_data';
import {IApplyCreateCFDOrderData} from './apply_create_cfd_order_data';
import {IApplyUpdateCFDOrderData} from './apply_update_cfd_order_data';

export type ApplyCFDOrderData =
  | IApplyCreateCFDOrderData
  | IApplyUpdateCFDOrderData
  | IApplyCloseCFDOrderData;

export interface IApplyCFDOrder {
  type: ICFDOrderType;
  data: ApplyCFDOrderData;
  signature: string;
}
