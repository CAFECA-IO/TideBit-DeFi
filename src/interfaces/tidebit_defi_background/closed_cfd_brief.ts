import {ICFDBrief} from './cfd_brief';
import {dummyCloseCFDDetails} from './closed_cfd_details';

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export const dummyCloseCFDBrief: IClosedCFDBrief = {
  id: dummyCloseCFDDetails.id,
  ticker: dummyCloseCFDDetails.ticker,
  typeOfPosition: dummyCloseCFDDetails.typeOfPosition,
  openPrice: dummyCloseCFDDetails.openPrice,
  openValue: dummyCloseCFDDetails.openValue,
  openTimestamp: dummyCloseCFDDetails.openTimestamp,
  pNL: dummyCloseCFDDetails.pnl,
  closedValue: dummyCloseCFDDetails.closedValue,
  closedTimestamp: dummyCloseCFDDetails.closedTimestamp,
};
