export type IEvents =
  | 'tickers'
  | 'trades'
  | 'candleOnUpdate'
  | 'subscribe'
  | 'unsubscribe'
  | 'error'
  | 'assets'
  | 'cfd'
  | 'bolt_transaction'
  | 'balance';

export interface IEventsConstant {
  TICKERS: IEvents;
  TRADES: IEvents;
  CANDLE_ON_UPDATE: IEvents;
  SUBSCRIBE: IEvents;
  UNSUBSCRIBE: IEvents;
  ERROR: IEvents;
  BOLT_TRANSACTION: IEvents;
  CFD: IEvents;
  BALANCE: IEvents;
  ASSETS: IEvents;
}

export const Events: IEventsConstant = {
  TICKERS: 'tickers',
  TRADES: 'trades',
  CANDLE_ON_UPDATE: 'candleOnUpdate',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  ERROR: 'error',
  BOLT_TRANSACTION: 'bolt_transaction',
  CFD: 'cfd',
  BALANCE: 'balance',
  ASSETS: 'assets',
};
