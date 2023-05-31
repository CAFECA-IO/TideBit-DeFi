import {ITrend} from '../../constants/trend';

export interface IFluctuating {
  type: ITrend;
  value: number;
  percentage: number;
}
