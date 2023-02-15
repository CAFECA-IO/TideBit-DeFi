import {IProfitState, ProfitState} from '../../constants/profit_state';

export interface IPnL {
  type: IProfitState;
  value: number;
}

const pnl: IPnL = {
  type: ProfitState.PROFIT,
  value: 100,
};
