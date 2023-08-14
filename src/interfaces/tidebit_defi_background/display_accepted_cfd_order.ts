import {ICFDSuggestion} from './cfd_suggestion';
import {getDummyApplyCreateCFDOrder} from './apply_create_cfd_order';
import {convertApplyCreateCFDToAcceptedCFD} from './apply_cfd_order';
import {randomHex, toDisplayCFDOrder} from '../../lib/common';
import {ICFDOrder} from './order';
import {OrderStatusUnion} from '../../constants/order_status_union';
import {getDummyAcceptedCloseCFDOrder} from './accepted_cfd_order';
import {ICurrency} from '../../constants/currency';

export interface IDisplayCFDOrder extends ICFDOrder {
  pnl?: number;
  /** Deprecated: (20230608 - tzuhan)
  positionLineGraph: number[];
  */
  openValue: number;
  suggestion: ICFDSuggestion;
  stateCode?: number;
}

export const getDummyDisplayCFDOrder = (currency: ICurrency) => {
  const dummyApplyCloseCFDOrder = getDummyApplyCreateCFDOrder(currency);
  const {CFDOrder} = convertApplyCreateCFDToAcceptedCFD(
    dummyApplyCloseCFDOrder,
    {currency, available: 10, locked: 0},
    randomHex(32),
    randomHex(32),
    randomHex(32)
  );
  const dummyPositionLineGraph: number[] = [90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10];
  CFDOrder.openPrice = dummyPositionLineGraph[0];
  const dummyDisplayCFDOrder: IDisplayCFDOrder = toDisplayCFDOrder(CFDOrder);
  return dummyDisplayCFDOrder;
};

export const listDummyDisplayCFDOrder = (currency: ICurrency) => {
  const count = 10;
  const list = new Array(count).fill(0).map(() => getDummyDisplayCFDOrder(currency));
  return list;
};
