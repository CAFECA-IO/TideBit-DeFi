import {ICurrency} from '../../constants/currency';
import {ProfitState} from '../../constants/profit_state';
import {randomIntFromInterval} from '../../lib/common';
import {IApplyCFDOrder} from './apply_cfd_order';
import {getDummyApplyCloseCFDOrder} from './apply_close_cfd_order';
import {getDummyApplyCreateCFDOrder} from './apply_create_cfd_order';
import {getDummyApplyUpdateCFDOrder} from './apply_update_cfd_order';
import {IPnL} from './pnl';

export interface IDisplayApplyCFDOrder extends IApplyCFDOrder {
  pnl?: IPnL;
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
    pnl: {
      type: randomIntFromInterval(1, 10) > 5 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: randomIntFromInterval(1, 1000),
    },
  };
  return dummyApplyUpdateCFDOrder;
};

export const getDummyDisplayApplyCloseCFDOrder = (currency: ICurrency, id?: string) => {
  const date = new Date();
  const dummyApplyCloseCFDOrder: IDisplayApplyCFDOrder = {
    ...getDummyApplyCloseCFDOrder(currency, id),
    pnl: {
      type: randomIntFromInterval(1, 10) > 5 ? ProfitState.PROFIT : ProfitState.LOSS,
      value: randomIntFromInterval(1, 1000),
    },
  };
  return dummyApplyCloseCFDOrder;
};
