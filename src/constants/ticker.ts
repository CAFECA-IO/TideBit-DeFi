export type ITicker = 'ETH-USDT' | 'BTC-USDT';
//   | 'LTC-USDT'
//   | 'MATIC-USDT'
//   | 'BNB-USDT'
//   | 'SOL-USDT'
//   | 'SHIB-USDT'
//   | 'DOT-USDT'
//   | 'ADA-USDT'
//   | 'AVAX-USDT'
//   | 'DAI-USDT'
//   | 'MKR-USDT'
//   | 'XRP-USDT'
//   | 'DOGE-USDT'
//   | 'UNI-USDT'
//   | 'FLOW-USDT';

export interface ITickerConstant {
  ETH_USDT: ITicker;
  BTC_USDT: ITicker;
  // LTC_USDT: ITicker;
  // MATIC_USDT: ITicker;
  // BNB_USDT: ITicker;
  // SOL_USDT: ITicker;
  // SHIB_USDT: ITicker;
  // DOT_USDT: ITicker;
  // ADA_USDT: ITicker;
  // AVAX_USDT: ITicker;
  // DAI_USDT: ITicker;
  // MKR_USDT: ITicker;
  // XRP_USDT: ITicker;
  // DOGE_USDT: ITicker;
  // UNI_USDT: ITicker;
  // FLOW_USDT: ITicker;
}

export const Ticker: ITickerConstant = {
  ETH_USDT: 'ETH-USDT',
  BTC_USDT: 'BTC-USDT',
  // LTC_USDT: 'LTC-USDT',
  // MATIC_USDT: 'MATIC_USDT';
  // BNB_USDT: 'BNB_USDT;
  // SOL_USDT: 'SOL_USDT;
  // SHIB_USDT: 'SHIB_USDT;
  // DOT_USDT: 'DOT_USDT;
  // ADA_USDT: 'ADA_USDT;
  // AVAX_USDT: 'AVAX_USDT;
  // DAI_USDT: 'DAI_USDT;
  // MKR_USDT: 'MKR_USDT;
  // XRP_USDT: 'XRP_USDT;
  // DOGE_USDT: 'DOGE_USDT;
  // UNI_USDT: 'UNI_USDT;
  // FLOW_USDT: 'FLOW_USDT;
};

export const TickerCode = {
  ETHUSDT: 'ETHUSDT',
  BTCUSDT: 'BTCUSDT',
  // LTCUSDT: 'LTCUSDT',
  // MATICUSDT: 'MATICUSDT',
  // BNBUSDT: 'BNBUSDT',
  // SOLUSDT: 'SOLUSDT',
  // SHIBUSDT: 'SHIBUSDT',
  // DOTUSDT: 'DOTUSDT',
  // ADAUSDT: 'ADAUSDT',
  // AVAXUSDT: 'AVAXUSDT',
  // DAIUSDT: 'DAIUSDT',
  // MKRUSDT: 'MKRUSDT',
  // XRPUSDT: 'XRPUSDT',
  // DOGEUSDT: 'DOGEUSDT',
  // UNIUSDT: 'UNIUSDT',
  // FLOWUSDT: 'FLOWUSDT',
};

export const CodeToTicker = {
  [TickerCode.ETHUSDT]: Ticker.ETH_USDT,
  [TickerCode.BTCUSDT]: Ticker.BTC_USDT,
  // [TickerCode.LTCUSDT]: Ticker.LTC_USDT,
  // [TickerCode.MATICUSDT]: Ticker.MATIC_USDT,
  // [TickerCode.BNBUSDT]: Ticker.BNB_USDT,
  // [TickerCode.SOLUSDT]: Ticker.SOL_USDT,
  // [TickerCode.SHIBUSDT]: Ticker.SHIB_USDT,
  // [TickerCode.DOTUSDT]: Ticker.DOT_USDT,
  // [TickerCode.ADAUSDT]: Ticker.ADA_USDT,
  // [TickerCode.AVAXUSDT]: Ticker.AVAX_USDT,
  // [TickerCode.DAIUSDT]: Ticker.DAI_USDT,
  // [TickerCode.MKRUSDT]: Ticker.MKR_USDT,
  // [TickerCode.XRPUSDT]: Ticker.XRP_USDT,
  // [TickerCode.DOGEUSDT]: Ticker.DOGE_USDT,
  // [TickerCode.UNIUSDT]: Ticker.UNI_USDT,
  // [TickerCode.FLOWUSDT]: Ticker.FLOW_USDT,
};
