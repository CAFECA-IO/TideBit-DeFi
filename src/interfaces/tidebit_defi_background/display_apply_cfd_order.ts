import {CFDOrderType, ICFDOrderType} from '../../constants/cfd_order_type';
import {ProfitState} from '../../constants/profit_state';
import {randomIntFromInterval} from '../../lib/common';
import {ApplyCFDOrderData, IApplyCFDOrder} from './apply_cfd_order';
import {getDummyApplyCloseCFDOrderData} from './apply_close_cfd_order_data';
import {
  IApplyCreateCFDOrderData,
  getDummyApplyCreateCFDOrderData,
} from './apply_create_cfd_order_data';
import {getDummyApplyUpdateCFDOrderData} from './apply_update_cfd_order_data';
import {IPnL} from './pnl';

export interface IDisplayApplyCFDOrder extends IApplyCFDOrder {
  pnl?: IPnL;
}

// ----------------Trial----------------

export interface ITestApplyCFDOrder {
  type: ICFDOrderType;
  data: IApplyCreateCFDOrderData;
  signature: string;
}

export const getTestDummyApplyCreateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyCreateCFDOrder: ITestApplyCFDOrder = {
    type: CFDOrderType.CREATE,
    data: getDummyApplyCreateCFDOrderData(currency),
    signature: '0x',
  };
  return dummyApplyCreateCFDOrder;
};

// ----------------Trial----------------

export const getDummyDisplayApplyCreateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyCreateCFDOrder: IDisplayApplyCFDOrder = {
    type: CFDOrderType.CREATE,
    data: getDummyApplyCreateCFDOrderData(currency),
    signature: '0x',
  };
  return dummyApplyCreateCFDOrder;
};

export const getDummyDisplayApplyUpdateCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyUpdateCFDOrder: IDisplayApplyCFDOrder = {
    type: CFDOrderType.UPDATE,
    data: getDummyApplyUpdateCFDOrderData(currency, id),
    signature: '0x',
    pnl: {
      type: randomIntFromInterval(1, 10) > 5 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: randomIntFromInterval(1, 1000),
    },
  };
  return dummyApplyUpdateCFDOrder;
};

export const getDummyDisplayApplyCloseCFDOrder = (currency: string, id?: string) => {
  const date = new Date();
  const dummyApplyCloseCFDOrder: IDisplayApplyCFDOrder = {
    type: CFDOrderType.CLOSE,
    data: getDummyApplyCloseCFDOrderData(currency, id),
    signature: '0x',
    pnl: {
      type: randomIntFromInterval(1, 10) > 5 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: randomIntFromInterval(1, 1000),
    },
  };
  return dummyApplyCloseCFDOrder;
};
