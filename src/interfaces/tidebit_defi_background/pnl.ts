import {IPnLType, PnLType} from '../../constants/pnl_type';

export interface IPnL {
  type: IPnLType;
  value: number;
}

// FIXME: There should be type hint and check by ts
const pnl: IPnL = {
  type: PnLType.PROFIT1,
  // symbol: '+',
  value: 100,
};
