import {IPnL} from './pnl';

export interface ICFDBrief {
  id: string;
  ticker: string;
  typeOfPosition: 'BUY' | 'SELL';
  openPrice: number;
  openValue: number;
  pNL: IPnL;
  openTimestamp: number;
}
