import {toQuery} from '../lib/common';

export type IAPIName =
  | 'LIST_TICKERS'
  | 'LIST_HISTORIES'
  | 'LIST_TRADES'
  | 'LIST_CFD_TRADES'
  | 'LIST_DEPOSIT_TRADES'
  | 'LIST_WITHDRAW_TRADES'
  | 'LIST_DEPOSIT_CRYPTO_CURRENCIES'
  | 'LIST_WITHDRAW_CRYPTO_CURRENCIES'
  | 'LIST_FAVORITE_TICKERS'
  | 'LIST_NEWS'
  | 'LIST_COURSES'
  | 'LIST_FAQS'
  | 'LIST_JOBS'
  | 'GET_GUARANTEED_STOP_FEE_PERCENTAGE'
  | 'GET_CANDLESTICK_DATA'
  | 'GET_PNL'
  | 'CREATE_CFD'
  | 'UPDATE_CFD'
  | 'CLOSE_CFD'
  | 'CREATE_DEPOSIT'
  | 'CREATE_WITHDRAW'
  | 'SEND_EMAIL_CODE'
  | 'CONNECT_TIDEBIT'
  | 'CONNECT_EMAIL'
  | 'UPDATE_USER_ICON'
  | 'SUBSCRIBE_NEWS_LETTERS'
  | 'APPLY_JOB'
  | 'REPORT_ISSUE';
export interface IAPINameConstant {
  LIST_TICKERS: IAPIName;
  LIST_HISTORIES: IAPIName;
  LIST_TRADES: IAPIName;
  LIST_CFD_TRADES: IAPIName;
  LIST_DEPOSIT_TRADES: IAPIName;
  LIST_WITHDRAW_TRADES: IAPIName;
  LIST_DEPOSIT_CRYPTO_CURRENCIES: IAPIName;
  LIST_WITHDRAW_CRYPTO_CURRENCIES: IAPIName;
  LIST_FAVORITE_TICKERS: IAPIName;
  LIST_NEWS: IAPIName;
  LIST_COURSES: IAPIName;
  LIST_FAQS: IAPIName;
  LIST_JOBS: IAPIName;
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: IAPIName;
  GET_CANDLESTICK_DATA: IAPIName;
  GET_PNL: IAPIName;
  CREATE_CFD: IAPIName;
  UPDATE_CFD: IAPIName;
  CLOSE_CFD: IAPIName;
  CREATE_DEPOSIT: IAPIName;
  CREATE_WITHDRAW: IAPIName;
  SEND_EMAIL_CODE: IAPIName;
  CONNECT_TIDEBIT: IAPIName;
  CONNECT_EMAIL: IAPIName;
  UPDATE_USER_ICON: IAPIName;
  SUBSCRIBE_NEWS_LETTERS: IAPIName;
  APPLY_JOB: IAPIName;
  REPORT_ISSUE: IAPIName;
}
export const APIName: IAPINameConstant = {
  LIST_TICKERS: 'LIST_TICKERS',
  LIST_HISTORIES: 'LIST_HISTORIES',
  LIST_TRADES: 'LIST_TRADES',
  LIST_CFD_TRADES: 'LIST_CFD_TRADES',
  LIST_DEPOSIT_TRADES: 'LIST_DEPOSIT_TRADES',
  LIST_WITHDRAW_TRADES: 'LIST_WITHDRAW_TRADES',
  LIST_DEPOSIT_CRYPTO_CURRENCIES: 'LIST_DEPOSIT_CRYPTO_CURRENCIES',
  LIST_WITHDRAW_CRYPTO_CURRENCIES: 'LIST_WITHDRAW_CRYPTO_CURRENCIES',
  LIST_FAVORITE_TICKERS: 'LIST_FAVORITE_TICKERS',
  LIST_NEWS: 'LIST_NEWS',
  LIST_COURSES: 'LIST_COURSES',
  LIST_FAQS: 'LIST_FAQS',
  LIST_JOBS: 'LIST_JOBS',
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: 'GET_GUARANTEED_STOP_FEE_PERCENTAGE',
  GET_CANDLESTICK_DATA: 'GET_CANDLESTICK_DATA',
  GET_PNL: 'GET_PNL',
  CREATE_CFD: 'CREATE_CFD',
  UPDATE_CFD: 'UPDATE_CFD',
  CLOSE_CFD: 'CLOSE_CFD',
  CREATE_DEPOSIT: 'CREATE_DEPOSIT',
  CREATE_WITHDRAW: 'CREATE_WITHDRAW',
  SEND_EMAIL_CODE: 'SEND_EMAIL_CODE',
  CONNECT_TIDEBIT: 'CONNECT_TIDEBIT',
  CONNECT_EMAIL: 'CONNECT_EMAIL',
  UPDATE_USER_ICON: 'UPDATE_USER_ICON',
  SUBSCRIBE_NEWS_LETTERS: 'SUBSCRIBE_NEWS_LETTERS',
  APPLY_JOB: 'APPLY_JOB',
  REPORT_ISSUE: 'REPORT_ISSUE',
};

export const APIURL = {
  LIST_TICKERS: '/api/tickers',
  LIST_HISTORIES: '/api/histories',
  LIST_TRADES: '/api/trades',
  LIST_CFD_TRADES: '/api/trades/cfds',
  LIST_DEPOSIT_TRADES: '/api/trades/deposits',
  LIST_WITHDRAW_TRADES: '/api/trades/withdraws',
  LIST_DEPOSIT_CRYPTO_CURRENCIES: '/api/deposits',
  LIST_WITHDRAW_CRYPTO_CURRENCIES: '/api/withdraws',
  LIST_FAVORITE_TICKERS: '/api/tickers',
  LIST_NEWS: '/api/news',
  LIST_COURSES: '/api/courses',
  LIST_FAQS: '/api/faqs',
  LIST_JOBS: '/api/jobs',
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: '/api/stopfeepercentage',
  GET_CANDLESTICK_DATA: '/api/candlesticks',
  GET_PNL: '/api/pnl',
  CREATE_CFD: '/api/trades/cfds',
  UPDATE_CFD: '/api/trades/cfds',
  CLOSE_CFD: '/api/trades/cfds',
  CREATE_DEPOSIT: '/api/trades/deposits',
  CREATE_WITHDRAW: '/api/trades/withdraws',
  SEND_EMAIL_CODE: '/api/user/email',
  CONNECT_TIDEBIT: '/api/tidebit',
  CONNECT_EMAIL: '/api/user/email',
  UPDATE_USER_ICON: '/api/user/icon',
  SUBSCRIBE_NEWS_LETTERS: '/api/newsletters',
  APPLY_JOB: '/api/jobs',
  REPORT_ISSUE: '/api/issues',
};

export const TBEURL = {
  // LIST_TICKERS: '/api/tickers',
  LIST_TRADES: '/market/trades', // ++ TODO: ticker => `${ticker}usdt` (20230315 - tzuhan)
  // SEND_EMAIL_CODE: '/api/user/email',
  // CONNECT_TIDEBIT: '/api/tidebit',
  // CONNECT_EMAIL: '/api/user/email',
  // UPDATE_USER_ICON: '/api/user/icon',
  // SUBSCRIBE_NEWS_LETTERS: '/api/newsletters',
  // LIST_FAVORITE_TICKERS: '/api/tickers',
  GET_CANDLESTICK_DATA: '/tradingview/history',
  // GET_PNL: '/api/pnl',
  // LIST_HISTORIES: '/api/histories',
  // LIST_DEPOSIT_CRYPTO_CURRENCIES: '/api/deposits',
  // LIST_WITHDRAW_CRYPTO_CURRENCIES: '/api/withdraws',
  // LIST_NEWS: '/api/',
  // LIST_COURSES: '/api/',
  // LIST_FAQS: '/api/faqs',
  // LIST_JOBS: '/api/jobs',
  // APPLY_JOB: '/api/jobs',
  // REPORT_ISSUE: '/api/issues',
};

export type TypeRequest = {
  name: IAPIName;
  request: {
    name: IAPIName;
    method: string;
    url: string;
    body?: object;
    options?: {
      headers?: object;
    };
  };
  callback: (...args: any[]) => void;
};

export const APIRequest = (data: {
  name: IAPIName;
  method: IMethodConstant;
  params?: {[key: string]: string | number | boolean};
  body?: object;
  headers?: object;
  callback?: (...args: any[]) => void;
}) => {
  const request: TypeRequest = {
    name: data.name,
    request: {
      name: data.name,
      method: Method[data.method],
      url: `${APIURL[data.name]}${toQuery(data.params)}`,
      body: data.body ? data.body : undefined,
      options: data.headers
        ? {
            headers: data.headers,
          }
        : undefined,
    },
    callback: data.callback ? data.callback : () => null,
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
