import {CFDOrderType, ICFDOrderType} from '../../constants/cfd_order_type';
import {
  getDummyApplyCloseCFDOrderData,
  IApplyCloseCFDOrderData,
} from './apply_close_cfd_order_data';
import {
  getDummyApplyCreateCFDOrderData,
  IApplyCreateCFDOrderData,
} from './apply_create_cfd_order_data';
import {
  getDummyApplyUpdateCFDOrderData,
  IApplyUpdateCFDOrderData,
} from './apply_update_cfd_order_data';

export type ApplyCFDOrderData =
  | IApplyCreateCFDOrderData
  | IApplyUpdateCFDOrderData
  | IApplyCloseCFDOrderData;

export interface IApplyCFDOrder {
  type: ICFDOrderType;
  data: ApplyCFDOrderData;
  signature: string;
}

export const getDummyApplyCreateCFDOrder = (currency: string) => {
  const dummyApplyCreateCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.CREATE,
    data: getDummyApplyCreateCFDOrderData(currency),
    signature: '0x',
  };
  return dummyApplyCreateCFDOrder;
};

export const getDummyApplyUpdateCFDOrder = (currency: string, id?: string) => {
  const dummyApplyUpdateCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.UPDATE,
    data: getDummyApplyUpdateCFDOrderData(currency, id),
    signature: '0x',
  };
  return dummyApplyUpdateCFDOrder;
};

export const getDummyApplyCloseCFDOrder = (currency: string, id?: string) => {
  const dummyApplyCloseCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.CLOSE,
    data: getDummyApplyCloseCFDOrderData(currency, id),
    signature: '0x',
  };
  return dummyApplyCloseCFDOrder;
};
