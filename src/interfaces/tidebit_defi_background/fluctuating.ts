export interface IFluctuating {
  type: 'PROFIT' | 'LOSS' | 'EMPTY';
  value: number;
  percentage: number;
}
