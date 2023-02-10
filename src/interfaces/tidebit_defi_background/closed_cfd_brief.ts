import {ICFDBrief} from './cfd_brief';

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export const dummyClosedCFDBrief: IClosedCFDBrief = {
  id: 'TBD202302070000002',
  ticker: 'ETH',
  typeOfPosition: 'BUY',
  openPrice: 24058,
  openValue: 74589658,
  pNL: {
    type: 'EQUAL',
    // symbol?: string; // + or -
    value: 0,
  },
  openTimestamp: 1675299651,
  closedTimestamp: 1675300651,
  closedValue: 24058,
};
