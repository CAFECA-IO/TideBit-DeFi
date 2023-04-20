export type ICurrency =
  | 'ETH'
  | 'BTC'
  | 'LTC'
  | 'MATIC'
  | 'BNB'
  | 'SOL'
  | 'SHIB'
  | 'DOT'
  | 'ADA'
  | 'AVAX'
  | 'Dai'
  | 'MKR'
  | 'XRP'
  | 'DOGE'
  | 'UNI'
  | 'Flow';

export interface ICurrencyConstant {
  ETH: ICurrency;
  BTC: ICurrency;
  LTC: ICurrency;
  MATIC: ICurrency;
  BNB: ICurrency;
  SOL: ICurrency;
  SHIB: ICurrency;
  DOT: ICurrency;
  ADA: ICurrency;
  AVAX: ICurrency;
  DAI: ICurrency;
  MKR: ICurrency;
  XRP: ICurrency;
  DOGE: ICurrency;
  UNI: ICurrency;
  FLOW: ICurrency;
}

export const Currency: ICurrencyConstant = {
  ETH: 'ETH',
  BTC: 'BTC',
  LTC: 'LTC',
  MATIC: 'MATIC',
  BNB: 'BNB',
  SOL: 'SOL',
  SHIB: 'SHIB',
  DOT: 'DOT',
  ADA: 'ADA',
  AVAX: 'AVAX',
  DAI: 'Dai',
  MKR: 'MKR',
  XRP: 'XRP',
  DOGE: 'DOGE',
  UNI: 'UNI',
  FLOW: 'Flow',
};
