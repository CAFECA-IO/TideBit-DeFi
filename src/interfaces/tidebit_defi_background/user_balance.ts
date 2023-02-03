import {IPnL} from './pnl';

export interface IUserBalance {
  available: number;
  locked: number;
  total: number;
  PNL: IPnL; // TODO: IPnLProps
}
