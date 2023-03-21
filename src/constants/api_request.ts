import {toQuery} from '../lib/common';

export type IAPIName =
  | 'LIST_TICKERS'
  | 'LIST_TRADES'
  | 'SEND_EMAIL_CODE'
  | 'CONNECT_TIDEBIT'
  | 'CONNECT_EMAIL'
  | 'UPDATE_USER_ICON'
  | 'SUBSCRIBE_NEWS_LETTERS'
  | 'LIST_FAVORITE_TICKERS'
  | 'GET_GUARANTEED_STOP_FEE_PERCENTAGE'
  | 'GET_CANDLESTICK_DATA'
  | 'GET_PNL'
  | 'LIST_HISTORIES'
  | 'LIST_DEPOSIT_CRYPTO_CURRENCIES'
  | 'LIST_WITHDRAW_CRYPTO_CURRENCIES'
  | 'LIST_NEWS'
  | 'LIST_COURSES'
  | 'LIST_FAQS'
  | 'LIST_JOBS'
  | 'APPLY_JOB'
  | 'REPORT_ISSUE';
export interface IAPINameConstant {
  LIST_TICKERS: IAPIName;
  LIST_TRADES: IAPIName;
  SEND_EMAIL_CODE: IAPIName;
  CONNECT_TIDEBIT: IAPIName;
  CONNECT_EMAIL: IAPIName;
  UPDATE_USER_ICON: IAPIName;
  SUBSCRIBE_NEWS_LETTERS: IAPIName;
  LIST_FAVORITE_TICKERS: IAPIName;
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: IAPIName;
  GET_CANDLESTICK_DATA: IAPIName;
  GET_PNL: IAPIName;
  LIST_HISTORIES: IAPIName;
  LIST_DEPOSIT_CRYPTO_CURRENCIES: IAPIName;
  LIST_WITHDRAW_CRYPTO_CURRENCIES: IAPIName;
  LIST_NEWS: IAPIName;
  LIST_COURSES: IAPIName;
  LIST_FAQS: IAPIName;
  LIST_JOBS: IAPIName;
  APPLY_JOB: IAPIName;
  REPORT_ISSUE: IAPIName;
}
export const APIName: IAPINameConstant = {
  LIST_TICKERS: 'LIST_TICKERS',
  LIST_TRADES: 'LIST_TRADES',
  SEND_EMAIL_CODE: 'SEND_EMAIL_CODE',
  CONNECT_TIDEBIT: 'CONNECT_TIDEBIT',
  CONNECT_EMAIL: 'CONNECT_EMAIL',
  UPDATE_USER_ICON: 'UPDATE_USER_ICON',
  SUBSCRIBE_NEWS_LETTERS: 'SUBSCRIBE_NEWS_LETTERS',
  LIST_FAVORITE_TICKERS: 'LIST_FAVORITE_TICKERS',
  GET_CANDLESTICK_DATA: 'GET_CANDLESTICK_DATA',
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: 'GET_GUARANTEED_STOP_FEE_PERCENTAGE',
  GET_PNL: 'GET_PNL',
  LIST_HISTORIES: 'LIST_HISTORIES',
  LIST_DEPOSIT_CRYPTO_CURRENCIES: 'LIST_DEPOSIT_CRYPTO_CURRENCIES',
  LIST_WITHDRAW_CRYPTO_CURRENCIES: 'LIST_WITHDRAW_CRYPTO_CURRENCIES',
  LIST_NEWS: 'LIST_NEWS',
  LIST_COURSES: 'LIST_COURSES',
  LIST_FAQS: 'LIST_FAQS',
  LIST_JOBS: 'LIST_JOBS',
  APPLY_JOB: 'APPLY_JOB',
  REPORT_ISSUE: 'REPORT_ISSUE',
};

export const APIURL = {
  LIST_TICKERS: '/api/tickers',
  LIST_TRADES: '/api/trades',
  SEND_EMAIL_CODE: '/api/user/email',
  CONNECT_TIDEBIT: '/api/tidebit',
  CONNECT_EMAIL: '/api/user/email',
  UPDATE_USER_ICON: '/api/user/icon',
  SUBSCRIBE_NEWS_LETTERS: '/api/newsletters',
  LIST_FAVORITE_TICKERS: '/api/tickers',
  GET_GUARANTEED_STOP_FEE_PERCENTAGE: '/api/stopfeepercentage',
  GET_CANDLESTICK_DATA: '/api/candlesticks',
  GET_PNL: '/api/pnl',
  LIST_HISTORIES: '/api/histories',
  LIST_DEPOSIT_CRYPTO_CURRENCIES: '/api/deposits',
  LIST_WITHDRAW_CRYPTO_CURRENCIES: '/api/withdraws',
  LIST_NEWS: '/api/',
  LIST_COURSES: '/api/',
  LIST_FAQS: '/api/faqs',
  LIST_JOBS: '/api/jobs',
  APPLY_JOB: '/api/jobs',
  REPORT_ISSUE: '/api/issues',
};

export const TBEURL = {
  // LIST_TICKERS: '/api/tickers',
  LIST_TRADES: '/market/trades', // ++ TODO: ticker => `${ticker}usdt` (20230315 - Tzuhan)
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
  method: IMethodConstant;
  params?: {[key: string]: string | number | boolean};
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
    options?: {
      headers?: object;
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
      url: `${APIURL[data.name]}${toQuery(data.params)}`,
      body: data.body ? data.body : undefined,
      options: data.headers
        ? {
            headers: data.headers,
          }
        : undefined,
    },
    /* Deprecated: callback in requestHandler (Tzuhan - 20230420)
    callback: (result: any, error: Error) => void;
    */
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
