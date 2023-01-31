export interface IFluctuating {
  type: 'UP' | 'DOWN' | 'EQUAL';
  value: number;
  percentage: number;
}
