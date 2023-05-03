import {ICFDSuggestion} from './cfd_suggestion';
import {IPnL} from './pnl';
import {getDummyApplyCreateCFDOrder} from './apply_create_cfd_order';
import {convertApplyCreateCFDToAcceptedCFD} from './apply_cfd_order';
import {randomHex, toDisplayCFDOrder} from '../../lib/common';
import {ICFDOrder} from './order';

export interface IDisplayCFDOrder extends ICFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
  suggestion: ICFDSuggestion;
  stateCode: number;
}

export const getDummyDisplayCFDOrder = (currency: string) => {
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
  const dummyDisplayCFDOrder: IDisplayCFDOrder = toDisplayCFDOrder(
    CFDOrder,
    dummyPositionLineGraph
  );
  return dummyDisplayCFDOrder;
};

export const listDummyDisplayCFDOrder = (currency: string) => {
  const count = 10;
  const list = new Array(count).fill(0).map(() => getDummyDisplayCFDOrder(currency));
  return list;
};
