import {IProfitState, ProfitState} from '../../constants/profit_state';

export interface IPnL {
  type: IProfitState;
  value: number;
  percent: number;
}

const pnl: IPnL = {
  type: ProfitState.PROFIT,
  value: 100,
  percent: 22,
};
