import {IPnL} from './pnl';

export interface DisplayAcceptedCFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
}
