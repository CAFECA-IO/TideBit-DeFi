import {ICFDDetails} from './cfd_details';

export interface IOpenCFDDetails extends ICFDDetails {
  state: 'OPENING';
}

export const dummyOpenCFDDetails: IOpenCFDDetails = {
  id: '123',
  ticker: 'BTC',
  amount: '1.8',
  state: 'OPENING',
  typeOfPosition: 'BUY',
  leverage: 5,
  margin: 7520,
  openPrice: '24058',
  fee: 0,
  guranteedStop: false,
  openTimestamp: 1675213251,
  scheduledClosingTimestamp: 1675299651, // openTimestamp + 86400
  openValue: 19247,
  pnl: {
    type: 'UP',
    value: 90752,
  },
  liquidationPrice: 0,
};
