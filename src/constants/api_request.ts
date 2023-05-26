import {toQuery} from '../lib/common';
import {API_URL} from './config';

export type IAPIName =
  // general
  | 'LIST_NEWS'
  | 'GET_NEW'
  | 'LIST_COURSES'
  | 'GET_COURSE'
  | 'LIST_NOTIFICATIONS'
  | 'GET_NOTIFICATION'
  | 'LIST_FAQS'
  | 'GET_FAQ'
  | 'REPORT_ISSUE'
  | 'LIST_JOBS'
  | 'GET_JOB'
  | 'APPLY_JOB'
  // public
  | 'GET_TIDEBIT_PROMOTION'
  | 'GET_WEBSITE_RESERVE'
  // market
  | 'LIST_CURRENCIES'
  | 'LIST_TICKERS'
  // | 'LIST_DEPOSIT_CRYPTO_CURRENCIES'
  // | 'LIST_WITHDRAW_CRYPTO_CURRENCIES'
  | 'GET_CANDLESTICK_DATA'
  | 'GET_CFD_QUOTATION'
  | 'GET_CFD_SUGGESTION'
  | 'GET_TICKER_HISTORY'
  | 'GET_GUARANTEED_STOP_FEE_PERCENTAGE'
  | 'GET_TICKER_STATIC'
  | 'GET_TICKER_LIVE_STATISTICS'
  | 'LIST_MARKET_TRADES'
  // trades
  | 'LIST_CFD_TRADES'
  | 'GET_CFD_TRADE'
  | 'CREATE_CFD_TRADE'
  | 'UPDATE_CFD_TRADE'
  | 'CLOSE_CFD_TRADE'
  | 'LIST_DEPOSIT_TRADES'
  | 'CREATE_DEPOSIT_TRADE'
  | 'LIST_WITHDRAW_TRADES'
  | 'CREATE_WITHDRAW_TRADE'
  // user
  | 'POST_DEWT'
  | 'LIST_HISTORIES'
  | 'LIST_FAVORITE_TICKERS'
  | 'ADD_FAVORITE_TICKERS'
  | 'REMOVE_FAVORITE_TICKERS'
  | 'LIST_BALANCES'
  | 'GET_USER_ASSETS'
  // | 'GET_TOTAL_BALANCE'
  | 'SEND_EMAIL_CODE'
  | 'CONNECT_EMAIL'
  | 'CONNECT_TIDEBIT'
  | 'UPDATE_USER_ICON'
  | 'LIST_SUBSCRIBE_STATUS'
  | 'SUBSCRIBE_EMAIL_NOTIFICATIONS'
  | 'SUBSCRIBE_NEWS_LETTERS'
  | 'LIST_READ_NOTIFICATIONS'
  | 'READ_NOTIFICATIONS'
  | 'GET_PNL'
  | 'ENABLE_CFD_SHARE'
  | 'SHARE_CFD';
export interface IAPINameConstant {
  // general
  LIST_NEWS: IAPIName;
  GET_NEW: IAPIName;
  LIST_COURSES: IAPIName;
  GET_COURSE: IAPIName;
  LIST_NOTIFICATIONS: IAPIName;
  GET_NOTIFICATION: IAPIName;
  LIST_FAQS: IAPIName;
  GET_FAQ: IAPIName;
  REPORT_ISSUE: IAPIName;
  LIST_JOBS: IAPIName;
  GET_JOB: IAPIName;
  APPLY_JOB: IAPIName;
  // public
  GET_TIDEBIT_PROMOTION: IAPIName;
  GET_WEBSITE_RESERVE: IAPIName;
  // market
  LIST_CURRENCIES: IAPIName;
  LIST_TICKERS: IAPIName;
  // LIST_DEPOSIT_CRYPTO_CURRENCIES: IAPIName;
  // LIST_WITHDRAW_CRYPTO_CURRENCIES: IAPIName;
  GET_CANDLESTICK_DATA: IAPIName;
  GET_CFD_QUOTATION: IAPIName;
  GET_CFD_SUGGESTION: IAPIName;
  GET_TICKER_HISTORY: IAPIName;
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: IAPIName;
  GET_TICKER_STATIC: IAPIName;
  GET_TICKER_LIVE_STATISTICS: IAPIName;
  LIST_MARKET_TRADES: IAPIName;
  // trades
  LIST_CFD_TRADES: IAPIName;
  GET_CFD_TRADE: IAPIName;
  CREATE_CFD_TRADE: IAPIName;
  UPDATE_CFD_TRADE: IAPIName;
  CLOSE_CFD_TRADE: IAPIName;
  LIST_DEPOSIT_TRADES: IAPIName;
  CREATE_DEPOSIT_TRADE: IAPIName;
  LIST_WITHDRAW_TRADES: IAPIName;
  CREATE_WITHDRAW_TRADE: IAPIName;
  // user
  POST_DEWT: IAPIName;
  LIST_HISTORIES: IAPIName;
  LIST_FAVORITE_TICKERS: IAPIName;
  ADD_FAVORITE_TICKERS: IAPIName;
  REMOVE_FAVORITE_TICKERS: IAPIName;
  LIST_BALANCES: IAPIName;
  GET_USER_ASSETS: IAPIName;
  // GET_TOTAL_BALANCE: IAPIName;
  SEND_EMAIL_CODE: IAPIName;
  CONNECT_EMAIL: IAPIName;
  CONNECT_TIDEBIT: IAPIName;
  UPDATE_USER_ICON: IAPIName;
  LIST_SUBSCRIBE_STATUS: IAPIName;
  SUBSCRIBE_EMAIL_NOTIFICATIONS: IAPIName;
  SUBSCRIBE_NEWS_LETTERS: IAPIName;
  LIST_READ_NOTIFICATIONS: IAPIName;
  READ_NOTIFICATIONS: IAPIName;
  GET_PNL: IAPIName;
  ENABLE_CFD_SHARE: IAPIName;
  SHARE_CFD: IAPIName;
}
export const APIName: IAPINameConstant = {
  // general
  LIST_NEWS: 'LIST_NEWS',
  GET_NEW: 'GET_NEW',
  LIST_COURSES: 'LIST_COURSES',
  GET_COURSE: 'GET_COURSE',
  LIST_NOTIFICATIONS: 'LIST_NOTIFICATIONS',
  GET_NOTIFICATION: 'GET_NOTIFICATION',
  LIST_FAQS: 'LIST_FAQS',
  GET_FAQ: 'GET_FAQ',
  REPORT_ISSUE: 'REPORT_ISSUE',
  LIST_JOBS: 'LIST_JOBS',
  GET_JOB: 'GET_JOB',
  APPLY_JOB: 'APPLY_JOB',
  // public
  GET_TIDEBIT_PROMOTION: 'GET_TIDEBIT_PROMOTION',
  GET_WEBSITE_RESERVE: 'GET_WEBSITE_RESERVE',
  // market
  LIST_CURRENCIES: 'LIST_CURRENCIES',
  LIST_TICKERS: 'LIST_TICKERS',
  // LIST_DEPOSIT_CRYPTO_CURRENCIES: 'LIST_DEPOSIT_CRYPTO_CURRENCIES',
  // LIST_WITHDRAW_CRYPTO_CURRENCIES: 'LIST_WITHDRAW_CRYPTO_CURRENCIES',
  GET_CANDLESTICK_DATA: 'GET_CANDLESTICK_DATA',
  GET_CFD_QUOTATION: 'GET_CFD_QUOTATION',
  GET_CFD_SUGGESTION: 'GET_CFD_SUGGESTION',
  GET_TICKER_HISTORY: 'GET_TICKER_HISTORY',
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: 'GET_GUARANTEED_STOP_FEE_PERCENTAGE',
  GET_TICKER_STATIC: 'GET_TICKER_STATIC',
  GET_TICKER_LIVE_STATISTICS: 'GET_TICKER_LIVE_STATISTICS',
  LIST_MARKET_TRADES: 'LIST_MARKET_TRADES',
  // trades
  LIST_CFD_TRADES: 'LIST_CFD_TRADES',
  GET_CFD_TRADE: 'GET_CFD_TRADE',
  CREATE_CFD_TRADE: 'CREATE_CFD_TRADE',
  UPDATE_CFD_TRADE: 'UPDATE_CFD_TRADE',
  CLOSE_CFD_TRADE: 'CLOSE_CFD_TRADE',
  LIST_DEPOSIT_TRADES: 'LIST_DEPOSIT_TRADES',
  CREATE_DEPOSIT_TRADE: 'CREATE_DEPOSIT_TRADE',
  LIST_WITHDRAW_TRADES: 'LIST_WITHDRAW_TRADES',
  CREATE_WITHDRAW_TRADE: 'CREATE_WITHDRAW_TRADE',
  // user
  POST_DEWT: 'POST_DEWT',
  LIST_HISTORIES: 'LIST_HISTORIES',
  LIST_FAVORITE_TICKERS: 'LIST_FAVORITE_TICKERS',
  ADD_FAVORITE_TICKERS: 'ADD_FAVORITE_TICKERS',
  REMOVE_FAVORITE_TICKERS: 'REMOVE_FAVORITE_TICKERS',
  LIST_BALANCES: 'LIST_BALANCES',
  GET_USER_ASSETS: 'GET_USER_ASSETS',
  // GET_TOTAL_BALANCE: 'GET_TOTAL_BALANCE',
  SEND_EMAIL_CODE: 'SEND_EMAIL_CODE',
  CONNECT_EMAIL: 'CONNECT_EMAIL',
  CONNECT_TIDEBIT: 'CONNECT_TIDEBIT',
  UPDATE_USER_ICON: 'UPDATE_USER_ICON',
  LIST_SUBSCRIBE_STATUS: 'LIST_SUBSCRIBE_STATUS',
  SUBSCRIBE_EMAIL_NOTIFICATIONS: 'SUBSCRIBE_EMAIL_NOTIFICATIONS',
  SUBSCRIBE_NEWS_LETTERS: 'SUBSCRIBE_NEWS_LETTERS',
  LIST_READ_NOTIFICATIONS: 'LIST_READ_NOTIFICATIONS',
  READ_NOTIFICATIONS: 'READ_NOTIFICATIONS',
  GET_PNL: 'GET_PNL',
  ENABLE_CFD_SHARE: 'ENABLE_CFD_SHARE',
  SHARE_CFD: 'SHARE_CFD',
};

export const APIURL = {
  // general
  LIST_NEWS: '/api/general/news',
  GET_NEW: '/api/general/news',
  LIST_COURSES: '/api/general/courses',
  GET_COURSE: '/api/general/courses',
  LIST_NOTIFICATIONS: '/api/general/notifications',
  GET_NOTIFICATION: '/api/general/notifications',
  LIST_FAQS: '/api/general/faqs',
  GET_FAQ: '/api/general/faqs',
  REPORT_ISSUE: '/api/general/issues',
  LIST_JOBS: '/api/general/jobs',
  GET_JOB: '/api/general/jobs',
  APPLY_JOB: '/api/general/jobs',
  // public
  GET_TIDEBIT_PROMOTION: `${API_URL}/public/promotion`,
  GET_WEBSITE_RESERVE: `${API_URL}/public/reserve`,
  // market
  LIST_CURRENCIES: `${API_URL}/currencies`,
  LIST_TICKERS: `${API_URL}/market/tickers`,
  // LIST_DEPOSIT_CRYPTO_CURRENCIES: '/api/market/deposit-currencies',
  // LIST_WITHDRAW_CRYPTO_CURRENCIES: '/api/market/withdraw-currencies',
  GET_CANDLESTICK_DATA: `${API_URL}/market/candlesticks`,
  GET_CFD_QUOTATION: `${API_URL}/market/qutation`,
  GET_CFD_SUGGESTION: `${API_URL}/market/suggestion`,
  GET_TICKER_HISTORY: '/api/market/histories', // deprecated: '/api/market/tickerhistory' (20230323 - tzuhan)
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: `${API_URL}/market/guaranteed-stop-fee`,
  GET_TICKER_STATIC: `${API_URL}/market/ticker-static`,
  GET_TICKER_LIVE_STATISTICS: `${API_URL}/market/ticker-live-statistics`,
  LIST_MARKET_TRADES: `${API_URL}/market/trades`,
  // trades
  LIST_CFD_TRADES: `${API_URL}/trade/cfds`,
  LIST_HISTORIES: `${API_URL}/trade/history`,
  GET_CFD_TRADE: '/api/trades/cfds',
  CREATE_CFD_TRADE: `${API_URL}/trade/cfds`,
  UPDATE_CFD_TRADE: `${API_URL}/trade/cfds/update`,
  CLOSE_CFD_TRADE: `${API_URL}/trade/cfds/close`,
  CREATE_DEPOSIT_TRADE: `${API_URL}/deposit`,
  LIST_DEPOSIT_TRADES: '/api/trades/deposits',
  LIST_WITHDRAW_TRADES: '/api/trades/withdraws',
  CREATE_WITHDRAW_TRADE: '/api/trades/withdraws',
  // user
  POST_DEWT: `${API_URL}/dewt`,
  LIST_BALANCES: `${API_URL}/balances`,
  GET_USER_ASSETS: `${API_URL}/assets`,
  // GET_TOTAL_BALANCE: `${API_URL}/balances/sum`,
  LIST_FAVORITE_TICKERS: '/api/user/tickers',
  ADD_FAVORITE_TICKERS: '/api/user/tickers',
  REMOVE_FAVORITE_TICKERS: '/api/user/tickers',
  SEND_EMAIL_CODE: '/api/user/code',
  CONNECT_EMAIL: '/api/user/email',
  CONNECT_TIDEBIT: '/api/user/tidebitt',
  UPDATE_USER_ICON: '/api/user/icon',
  LIST_SUBSCRIBE_STATUS: '/api/user/subscrible',
  SUBSCRIBE_EMAIL_NOTIFICATIONS: '/api/user/subscrible',
  SUBSCRIBE_NEWS_LETTERS: '/api/user/subscrible',
  LIST_READ_NOTIFICATIONS: '/api/user/notifications',
  READ_NOTIFICATIONS: '/api/user/notifications',
  GET_PNL: '/api/user/pnl',
  ENABLE_CFD_SHARE: `${API_URL}/trade/cfds/share`,
  SHARE_CFD: `${API_URL}/public/shared/cfd`,
};

export const TBEURL = {
  LIST_TICKERS: '/market/tickers?instType=SPOT',
  LIST_TRADES: '/market/trades', // ++ TODO: ticker => `${ticker}usdt` (20230315 - Tzuhan)
  GET_CANDLESTICK_DATA: '/tradingview/history',
};

export const TBDURL = {
  COMING_SOON: '/coming-soon',
  TRADE: '/trade/cfd/ethusdt',
  MY_ASSETS: '/my-assets',
  LEADERBOARD: '/leaderboard',
};

export type TypeRequest = {
  name: IAPIName;
  method: IMethodConstant;
  params?: string;
  query?: {[key: string]: string | number | boolean};
  body?: object;
  headers?: object;
  /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
  callback: (result: any, error: Error) => void;
  */
};

export type FormatedTypeRequest = {
  name: IAPIName;
  request: {
    name: IAPIName;
    method: string;
    url: string;
    body?: object;
    options: {
      headers: object;
    };
  };
  /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
  callback: (result: any, error: Error) => void;
  */
};

export const formatAPIRequest = (data: TypeRequest) => {
  const request: FormatedTypeRequest = {
    name: data.name,
    request: {
      name: data.name,
      method: Method[data.method],
      url: `${APIURL[data.name]}${data.params ? `/${data.params}` : ''}${toQuery(data.query)}`,
      body: data.body ? data.body : undefined,
      options: data.headers
        ? {
            headers: {
              'Content-Type': 'application/json',
              ...data.headers,
            },
          }
        : {
            headers: {
              'Content-Type': 'application/json',
            },
          },
    },
  };
  return request;
};

export type IMethodConstant = 'GET' | 'PUT' | 'DELETE' | 'POST';
export interface IMethod {
  GET: IMethodConstant;
  PUT: IMethodConstant;
  DELETE: IMethodConstant;
  POST: IMethodConstant;
}
export const Method: IMethod = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};
