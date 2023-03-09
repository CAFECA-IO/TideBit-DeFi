export type IEvents =
  | 'tickers'
  | 'update'
  | 'trades'
  | 'publicTrades'
  | 'account'
  | 'order'
  | 'trade'
  | 'candleOnUpdate';
export interface IEventsConstant {
  TICKERS: IEvents;
  UPDATE: IEvents;
  TRADES: IEvents;
  PUBILC_TRADES: IEvents;
  ACCOUNT: IEvents;
  ORDER: IEvents;
  TRADE: IEvents;
  CANDLE_ON_UPDATE: IEvents;
}
export const Events: IEventsConstant = {
  TICKERS: 'tickers',
  UPDATE: 'update',
  TRADES: 'trades',
  PUBILC_TRADES: 'publicTrades',
  ACCOUNT: 'account',
  ORDER: 'order',
  TRADE: 'trade',
  CANDLE_ON_UPDATE: 'candleOnUpdate',
};
