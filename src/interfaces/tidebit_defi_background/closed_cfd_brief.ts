import {PnLType} from '../../constants/pnl_type';
import {ICFDBrief} from './cfd_brief';
import {dummyCloseCFDDetails} from './closed_cfd_details';

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
    pnl: {
      type: PnLType.EMPTY,
      // symbol?: string; // + or -
      value: 0,
    },
    openTimestamp: 1675299651,
    closedTimestamp: 1675300651,
    closedValue: 24058,
    amount: 74589658 / 24058,
    state: 'CLOSED',
    leverage: 5,
    margin: 74589658 / 5,
    recommendedTp: 24058 * 1.2,
    recommendedSl: 24058 * 0.8,
    guaranteedStop: false,
    guaranteedStopFee: 1.0,
    fee: 0,
    scheduledClosingTimestamp: 1675299651 + 86400,
    liquidationPrice: 24058 / (74589658 / 24058),
  },
  {
    id: 'TBD202302070000005',
    ticker: 'ETH',
    typeOfPosition: 'BUY',
    openPrice: 24058,
    openValue: 74589658,
    pnl: {
      type: PnLType.EMPTY,
      value: 0,
    },
    openTimestamp: 1675299651,
    closedTimestamp: 1675300651,
    closedValue: 24058,
    amount: 74589658 / 24058,
    state: 'CLOSED',
    leverage: 5,
    margin: 74589658 / 5,
    recommendedTp: 24058 * 1.2,
    recommendedSl: 24058 * 0.8,
    guaranteedStop: false,
    guaranteedStopFee: 1.0,
    fee: 0,
    scheduledClosingTimestamp: 1675299651 + 86400,
    liquidationPrice: 24058 / (74589658 / 24058),
  },
  {
    id: 'TBD202302070000006',
    ticker: 'ETH',
    typeOfPosition: 'BUY',
    openPrice: 24058,
    openValue: 74589658,
    pnl: {
      type: PnLType.EMPTY,
      // symbol?: string; // + or -
      value: 0,
    },
    openTimestamp: 1675299651,
    closedTimestamp: 1675300651,
    closedValue: 24058,
    amount: 74589658 / 24058,
    state: 'CLOSED',
    leverage: 5,
    margin: 74589658 / 5,
    recommendedTp: 24058 * 1.2,
    recommendedSl: 24058 * 0.8,
    guaranteedStop: false,
    guaranteedStopFee: 1.0,
    fee: 0,
    scheduledClosingTimestamp: 1675299651 + 86400,
    liquidationPrice: 24058 / (74589658 / 24058),
  },
];

export const dummyClosedCFDBrief = dummyClosedCFDBriefs[0];
