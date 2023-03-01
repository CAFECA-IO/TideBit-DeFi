import EventEmitter from 'events';

export type ITideBitEvent = 'CONNECTED' | 'DISCONNECTED' | 'ACCOUNT_CHANGED';
export interface ITideBitEventConstant {
  CONNECTED: ITideBitEvent;
  DISCONNECTED: ITideBitEvent;
  ACCOUNT_CHANGED: ITideBitEvent;
}
export const TideBitEvent: ITideBitEventConstant = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
};

export type IClickEvent = 'TICKER_CHANGED';

export interface IClickEventConstant {
  TICKER_CHANGED: IClickEvent;
}

export const ClickEvent: IClickEventConstant = {
  TICKER_CHANGED: 'TICKER_CHANGED',
};

const eventEmitter = new EventEmitter();

export default eventEmitter;
