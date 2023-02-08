import {ICFDBrief} from './cfd_brief';

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export const dummyCloseCFDBrief: IClosedCFDBrief = {
  id: 'TBD202302080000001',
  ticker: 'ETH',
  typeOfPosition: 'SELL',
  openPrice: 37.8,
  openValue: 739.2,
  openTimestamp: 12,
  closedTimestamp: 9,
  closedValue: 824.3,
  pNL: {
    type: 'DOWN',
    symbol: '-',
    value: 90204,
  },
};
