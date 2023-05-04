import {IBalance} from './balance';
import {ICandlestick} from './candlestickData';
import {ICFDOrder} from './order';
import {ITickerData} from './ticker_data';

export interface IPusherData {
  action: IPusherAction;
  data: ICandlestick | ITickerData;
}

export interface IPusherPrivateData {
  data: IBalance | ICFDOrder;
}

export interface IPusherResponse {
  channel: IPusherChannel;
  event: string;
  data: IPusherData;
}

export type IPusherChannel = 'global-channel' | 'private-channel' | 'private_channel';
export interface IPusherChannelConstant {
  GLOBAL_CHANNEL: IPusherChannel;
  PRIVATE_CHANNEL: IPusherChannel;
  PRIVATE_CHANNEL_TEMP: IPusherChannel;
}
export const PusherChannel: IPusherChannelConstant = {
  GLOBAL_CHANNEL: 'global-channel',
  PRIVATE_CHANNEL: 'private-channel',
  PRIVATE_CHANNEL_TEMP: 'private_channel', // Deprecated: this is workaround for privateChannel (20230509 - tzuhan)
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
