export type ITideBitEvent =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ACCOUNT_CHANGED'
  | 'SERVICE_TERM_ENABLED'
  | 'NOTIFICATIONS'
  | 'UPDATE_READ_NOTIFICATIONS'
  | 'UPDATE_READ_NOTIFICATIONS_RESULT'
  | 'BALANCE'
  | 'BALANCES'
  | 'TICKER_CHANGE'
  | 'TICKER'
  | 'TICKER_STATISTIC'
  | 'TICKER_LIVE_STATISTIC'
  | 'CANDLESTICK'
  // | 'OPEN_CFD'
  // | 'CLOSE_CFD'
  // | 'DEPOSIT'
  // | 'WITHDRAW'
  | 'ORDER'
  | 'IS_CFD_TRADEBLE';
export interface ITideBitEventConstant {
  CONNECTED: ITideBitEvent;
  DISCONNECTED: ITideBitEvent;
  ACCOUNT_CHANGED: ITideBitEvent;
  SERVICE_TERM_ENABLED: ITideBitEvent;
  NOTIFICATIONS: ITideBitEvent;
  UPDATE_READ_NOTIFICATIONS: ITideBitEvent;
  UPDATE_READ_NOTIFICATIONS_RESULT: ITideBitEvent;
  BALANCE: ITideBitEvent;
  BALANCES: ITideBitEvent;
  TICKER: ITideBitEvent;
  TICKER_CHANGE: ITideBitEvent;
  TICKER_STATISTIC: ITideBitEvent;
  TICKER_LIVE_STATISTIC: ITideBitEvent;
  CANDLESTICK: ITideBitEvent;
  // OPEN_CFD: ITideBitEvent;
  // CLOSE_CFD: ITideBitEvent;
  // DEPOSIT: ITideBitEvent;
  // WITHDRAW: ITideBitEvent;
  ORDER: ITideBitEvent;
  IS_CFD_TRADEBLE: ITideBitEvent;
}
export const TideBitEvent: ITideBitEventConstant = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  SERVICE_TERM_ENABLED: 'SERVICE_TERM_ENABLED',
  NOTIFICATIONS: 'NOTIFICATIONS',
  UPDATE_READ_NOTIFICATIONS: 'UPDATE_READ_NOTIFICATIONS',
  UPDATE_READ_NOTIFICATIONS_RESULT: 'UPDATE_READ_NOTIFICATIONS_RESULT',
  BALANCE: 'BALANCE',
  BALANCES: 'BALANCES',
  TICKER: 'TICKER',
  TICKER_CHANGE: 'TICKER_CHANGE',
  TICKER_STATISTIC: 'TICKER_STATISTIC',
  TICKER_LIVE_STATISTIC: 'TICKER_LIVE_STATISTIC',
  CANDLESTICK: 'CANDLESTICK',
  // OPEN_CFD: 'OPEN_CFD',
  // CLOSE_CFD: 'CLOSE_CFD',
  // DEPOSIT: 'DEPOSIT',
  // WITHDRAW: 'WITHDRAW',
  ORDER: 'ORDER',
  IS_CFD_TRADEBLE: 'IS_CFD_TRADEBLE',
};

export type IClickEvent = 'TICKER_CHANGED';

export interface IClickEventConstant {
  TICKER_CHANGED: IClickEvent;
}

export const ClickEvent: IClickEventConstant = {
  TICKER_CHANGED: 'TICKER_CHANGED',
};
