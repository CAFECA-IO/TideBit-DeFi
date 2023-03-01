import {IPnL} from './pnl';

export interface DisplayAcceptedCFDOrder {
  pnl: IPnL;
  positionLineGraph: number[];
}
