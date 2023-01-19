import {IPnL} from './pnl';

export interface ICFDBrief {
  id: string;
  ticker: string;
  operation: 'BUY' | 'SELL';
  openPrice: number;
  openValue: number;
  pNL: IPnL;
}
