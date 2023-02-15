import {IProfitState} from '../../constants/profit_state';

export interface IPnL {
  type: IProfitState;
  symbol?: string; // + or -
  value: number;
}
