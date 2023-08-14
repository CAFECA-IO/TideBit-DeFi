import {ICurrency} from '../../constants/currency';
import {CFDOperation, ICFDOperation} from '../../constants/cfd_order_type';
import {OrderType} from '../../constants/order_type';
import {randomIntFromInterval} from '../../lib/common';
import {IApplyCFDOrder} from './apply_cfd_order';
import {getDummyApplyCloseCFDOrder} from './apply_close_cfd_order';
import {IApplyCreateCFDOrder, getDummyApplyCreateCFDOrder} from './apply_create_cfd_order';
import {getDummyApplyUpdateCFDOrder} from './apply_update_cfd_order';

export interface IDisplayApplyCFDOrder extends IApplyCFDOrder {
  pnl?: number;
}

export const getDummyDisplayApplyCreateCFDOrder = (currency: ICurrency, id?: string) => {
  // const date = new Date();
  const dummyApplyCreateCFDOrder: IDisplayApplyCFDOrder = {
    ...getDummyApplyCreateCFDOrder(currency),
  };
  return dummyApplyCreateCFDOrder;
};

export const getDummyDisplayApplyUpdateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyUpdateCFDOrder: IDisplayApplyCFDOrder = {
    ...getDummyApplyUpdateCFDOrder(currency, id),
    pnl: randomIntFromInterval(1, 1000),
  };
  return dummyApplyUpdateCFDOrder;
};

export const getDummyDisplayApplyCloseCFDOrder = (currency: ICurrency, id?: string) => {
  const date = new Date();
  const dummyApplyCloseCFDOrder: IDisplayApplyCFDOrder = {
    ...getDummyApplyCloseCFDOrder(currency, id),
    pnl: randomIntFromInterval(1, 1000),
  };
  return dummyApplyCloseCFDOrder;
};
