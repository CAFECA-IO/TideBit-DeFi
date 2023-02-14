import {IPnLType, PnLType} from '../../constants/pnl_type';

export interface IPnL {
  type: IPnLType;
  value: number;
}

const pnl: IPnL = {
  type: PnLType.PROFIT,
  // symbol: '+',
  value: 100,
};
