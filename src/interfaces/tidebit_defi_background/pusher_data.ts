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

export type IPusherChannel = 'global_channel' | 'private_channel';
export interface IPusherChannelConstant {
  GLOBAL_CHANNEL: IPusherChannel;
  PRIVATE_CHANNEL: IPusherChannel;
}
export const PusherChannel: IPusherChannelConstant = {
  GLOBAL_CHANNEL: 'global_channel',
  PRIVATE_CHANNEL: 'private_channel',
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
