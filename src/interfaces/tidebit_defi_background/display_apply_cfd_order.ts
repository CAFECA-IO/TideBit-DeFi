import {IApplyCFDOrder} from './apply_cfd_order';
import {IPnL} from './pnl';

export interface IDisplayApplyCFDOrder extends IApplyCFDOrder {
  pnl: IPnL;
}
