export interface IPnL {
  type: 'UP' | 'DOWN' | 'EQUAL';
  symbol?: string; // + or -
  value: number;
}
