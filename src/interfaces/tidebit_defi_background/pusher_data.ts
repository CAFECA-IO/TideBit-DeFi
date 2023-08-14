import {IEvents} from '../../constants/events';
import {IAcceptedOrder} from './accepted_order';
import {IBalance} from './balance';
import {ICandlestick, ITrade} from './candlestickData';
import {ICFDOrder} from './order';
import {ITickerData} from './ticker_data';

export type IPusherData = ICandlestick | ITickerData | ITrade;

export interface IPusherPrivateData {
  data:
    | IBalance
    | ICFDOrder
    | IAcceptedOrder
    | {
        available: number;
        locked: number;
        PnL?: {amount: number; percentage: number};
      };
}

export interface IPusherResponse {
  channel: IPusherChannel;
  event: IEvents;
  data: IPusherData;
}

export type IPusherChannel = 'global-channel' | 'private_channel';
export interface IPusherChannelConstant {
  GLOBAL_CHANNEL: IPusherChannel;
  PRIVATE_CHANNEL: IPusherChannel;
}
export const PusherChannel: IPusherChannelConstant = {
  GLOBAL_CHANNEL: 'global-channel',
  PRIVATE_CHANNEL: 'private_channel', // Info: this is a workaround, official private channel is with the prefix: private- (20230506 - tzuhan), will fixed by #606
};

export type IPusherAction = 'SNAPSHOT' | 'UPDATE';
export interface IPusherActionConstant {
  SNAPSHOT: IPusherAction;
  UPDATE: IPusherAction;
}
export const PusherAction: IPusherActionConstant = {
  SNAPSHOT: 'SNAPSHOT',
  UPDATE: 'UPDATE',
};
