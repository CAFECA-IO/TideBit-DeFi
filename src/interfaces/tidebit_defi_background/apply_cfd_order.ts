import {CFDOrderType, ICFDOrderType} from '../../constants/cfd_order_type';
import {OrderState} from '../../constants/order_state';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {OrderType} from '../../constants/order_type';
import {getTimestamp} from '../../lib/common';
import {IAcceptedCFDOrder} from './accepted_cfd_order';
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

// ++ TODO temp id then replace by DB id
export const convertApplyCreateCFDToAcceptedCFD = (applyCFDData: IApplyCreateCFDOrderData) => {
  const date = new Date();
  const id = `CFD${date.getTime()}${applyCFDData.ticker}${Math.ceil(Math.random() * 1000000000)}`;
  const accpetedCFDOrder: IAcceptedCFDOrder = {
    id,
    ...applyCFDData,
    orderStatus: OrderStatusUnion.WAITING,
    state: OrderState.OPENING,
    openPrice: applyCFDData.price,
    closePrice: 0,
    orderType: OrderType.CFD,
    createTimestamp: applyCFDData.createTimestamp ? applyCFDData.createTimestamp : getTimestamp(),
  };
  return accpetedCFDOrder;
};

export const convertApplyUpdateCFDToAcceptedCFD = (
  applyCFDData: IApplyUpdateCFDOrderData,
  accpetedCFDOrder: IAcceptedCFDOrder
) => {
  const updateAccpetedCFDOrder: IAcceptedCFDOrder = {
    ...accpetedCFDOrder,
    orderStatus: OrderStatusUnion.WAITING,
    takeProfit: applyCFDData.takeProfit ? applyCFDData.takeProfit : accpetedCFDOrder.takeProfit,
    stopLoss: applyCFDData.stopLoss ? applyCFDData.stopLoss : accpetedCFDOrder.stopLoss,
    guaranteedStop: applyCFDData.guaranteedStop
      ? applyCFDData.guaranteedStop
      : accpetedCFDOrder.guaranteedStop,
    guaranteedStopFee: applyCFDData.guaranteedStopFee
      ? applyCFDData.guaranteedStopFee
      : accpetedCFDOrder.guaranteedStopFee,
  };
  return updateAccpetedCFDOrder;
};

export const convertApplyCloseCFDToAcceptedCFD = (
  applyCFDData: IApplyCloseCFDOrderData,
  accpetedCFDOrder: IAcceptedCFDOrder
) => {
  const updateAccpetedCFDOrder: IAcceptedCFDOrder = {
    ...accpetedCFDOrder,
    orderStatus: OrderStatusUnion.WAITING,
    state: OrderState.CLOSED,
    closePrice: applyCFDData.closePrice,
    closeTimestamp: applyCFDData.closeTimestamp ? applyCFDData.closeTimestamp : getTimestamp(),
  };
  return updateAccpetedCFDOrder;
};
