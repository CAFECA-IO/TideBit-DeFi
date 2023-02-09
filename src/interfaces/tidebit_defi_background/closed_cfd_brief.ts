import {ICFDBrief} from './cfd_brief';

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export const dummyClosedCFDBriefs: IClosedCFDBrief[] = [
  {
    id: 'TBD202302070000004',
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
  },
  {
    id: 'TBD202302070000005',
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
  },
  {
    id: 'TBD202302070000006',
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
  },
];
