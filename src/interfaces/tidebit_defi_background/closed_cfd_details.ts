import {ICFDDetails} from './cfd_details';

export interface IClosedCFDDetails extends ICFDDetails {
  state: 'CLOSED';
  closedType: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;
  closedTimestamp: number; // remaining hrs gained from context
  closedValue: number;
}
