import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {ICFDSuggestion} from './cfd_suggestion';
import {IPnL} from './pnl';

export interface IDisplayAcceptedCFDOrder extends IAcceptedCFDOrder {
  pnl: IPnL;
  openValue: number;
  closeValue?: number;
  positionLineGraph: number[];
  suggestion: ICFDSuggestion;
}
