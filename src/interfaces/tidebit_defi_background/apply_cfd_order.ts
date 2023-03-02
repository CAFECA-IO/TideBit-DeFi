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

// TODO: IApplyCFDOrder['data'] is `any` type
export interface IApplyCFDOrder {
  type: ICFDOrderType;
  data: ApplyCFDOrderData; // TODO: separate to 3 types
  signature: string;
}

export const getDummyApplyCreateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyCreateCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.CREATE,
    data: getDummyApplyCreateCFDOrderData(currency),
    signature: '0x',
  };
  return dummyApplyCreateCFDOrder;
};

export const getDummyApplyUpdateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyUpdateCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.UPDATE,
    data: getDummyApplyUpdateCFDOrderData(currency, id),
    signature: '0x',
  };
  return dummyApplyUpdateCFDOrder;
};

export const getDummyApplyCloseCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyCloseCFDOrder: IApplyCFDOrder = {
    type: CFDOrderType.CLOSE,
    data: getDummyApplyCloseCFDOrderData(currency, id),
    signature: '0x',
  };
  return dummyApplyCloseCFDOrder;
};
