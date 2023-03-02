import {CFDOrderType, ICFDOrderType} from '../../constants/cfd_order_type';
import {
  getDummyApplyCloseCFDOrderData,
  IApplyCloseCFDOrderData,
} from './apply_close_cfd_order_data';
import {
  getDummyApplyCreateCFDOrderData,
  IApplyCreateCFDOrderData,
} from './apply_create_cfd_order_data';
import {IApplyOrder} from './apply_order';
import {
  getDummyApplyUpdateCFDOrderData,
  IApplyUpdateCFDOrderData,
} from './apply_update_cfd_order_data';

export type ApplyCFDOrderData =
  | IApplyCreateCFDOrderData
  | IApplyUpdateCFDOrderData
  | IApplyCloseCFDOrderData;

export interface IApplyCFDOrder extends IApplyOrder {
  type: ICFDOrderType;
  data: ApplyCFDOrderData;
}

// export interface IApplyCreateCFDOrder extends IApplyOrder {
//   type: ICFDOrderType;
//   data: IApplyCreateCFDOrderData;
// }

// export interface IApplyUpdateCFDOrder extends IApplyOrder {
//   type: ICFDOrderType;
//   data: IApplyUpdateCFDOrderData;
// }

// export interface IApplyCloseCFDOrder extends IApplyOrder {
//   type: ICFDOrderType;
//   data: IApplyCloseCFDOrderData;
// }

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
