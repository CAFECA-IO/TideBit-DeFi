import {ITrend} from '../../constants/trend';

export interface IPnL {
  type: ITrend;
  symbol?: string; // + or -
  value: number;
}
