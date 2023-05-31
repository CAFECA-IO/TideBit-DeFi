import {IPnL} from './pnl';

export interface IUserBalance {
  available: number;
  locked: number;
  total: number;
  PnL: IPnL;
}
