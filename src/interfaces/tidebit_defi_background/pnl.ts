import {IProfitState} from '../../constants/profit_state';

export interface IPnL {
  type: IProfitState;
  value: number;
}
