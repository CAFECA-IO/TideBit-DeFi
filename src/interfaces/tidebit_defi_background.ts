export interface IUser {
  id: string | null;
  username: string | null;
  email: string | null;
  wallet: string | null;
  favoriteTickers: ITickerItem[];
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnected: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  walletId: string | null;
  tideBitId: string | null;
  enableServiceTerm: boolean;

  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  signServiceTerm: () => Promise<boolean>;
  addFavoriteTicker: (props: ITickerItem) => Promise<void>;
  removeFavoriteTicker: (props: ITickerItem) => Promise<void>;

  balances: IUserBalance;
  walletBalance: number;
  // getTotalBalace: () => IUserBalance;
  // getPnL: () => null;

  CFDDetails: ICFDDetails;

  openItem: IOpenCFD[];
  closedItem: IClosedCFD[];
  // getOpenedCFD: () => ICFDDetails[];
  // getClosedCFD: () => ICFDDetails[];

  createOrder: (props: ICFDOrderRequest) => Promise<ICFDDetails>;
  closeOrder: (props: {id: string}) => Promise<ICFDDetails>;
  updateOrder: (props: {
    id: string;
    takeProfit?: number;
    stopLoss?: number;
    guranteedStop: boolean;
  }) => Promise<ICFDDetails>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
  deposit: (props: {asset: string; amount: number}) => Promise<TransferStateUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<TransferStateUnion>;

  // -----------Ignores below----------------
  // 拿到所有withdraw / deposit / CFD 紀錄
  // receipts: IReceipt[];
  // getHistory: () => null;
  // + getHistory():Array<SignedOrder:SignedWithdraw, SingedDeposit, SignedCFD>
}

export type TransferStateUnion = 'processing' | 'success' | 'cancellation' | 'fail';

// -----------Ignores below----------------
// export interface IReceipt {
//   // id: string;
//   // ad: string; // month & year
//   timestamp: number;
//   type: 'DEPOSIT' | 'WITHDRAW' | 'OPEN_POSITION' | 'CLOSE_POSITION';
//   asset: string;
//   amount: number;
//   details: IReceiptDetails;
//   fee: number;
//   available: number; // available balance after this transaction
// }

// export interface IReceiptDetails {
//   state: TransferStateUnion;
//   tx?: string; // tx hash (on etherscan?)
//   CFD?: {
//     ticker: string;
//   }
// }

// 使用格式

// export interface ICFDDisclosure {

// }

export interface IOpenCFD {
  id: string;
  ticker: string;
  operation: 'BUY' | 'SELL';
  // openTimestamp: number;
  remainingHrs: number;
  openValue: number;
  pNL: number;
  positionLineGraph: ITickerLineGraph;
}

export interface IClosedCFD {
  id: string;
  ticker: string;
  operation: 'BUY' | 'SELL';
  closedTimestamp: number;
  openValue: number;
  closedValue: number;
  pNL: number;
}

export interface IOpenCFDDetails {
  id: string;

  ticker: string; // 'BTC' | 'ETH'
  operation: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  fee: number;

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: number; // calculated by context

  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}

// export interface IPNL {
//   profitOrLoss: number;
//   amount: number;
// }

export interface IClosedCFDDetails extends IOpenCFDDetails {
  closedType: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;
  closedTimestamp: number; // remaining hrs gained from context
  closedValue: number;
}

export interface ICFDDetails {
  id: string;

  ticker: string; // 'BTC' | 'ETH'
  operation: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  fee: number;

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  closedType?: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  // estimatedFilledPrice: number; // estimated filled price 預估成交價格
  closedPrice?: number;

  pnl: number; // calculated by context
  state: 'OPENING' | 'CLOSED';

  closedTimestamp?: number; // remaining hrs gained from context
  closedValue?: number;
  liquidationPrice: number; // 強平價 / 清算水平 stop-out level

  // positionLineGraph: ITickerLineGraph;
  // positionLineGraph: (props: {openTimestamp: number; openPrice: number}) => ITickerLineGraph;
}

export interface ICFDOrderRequest {
  ticker: string;
  operation: 'BUY' | 'SELL';
  leverage: number;
  margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  estimatedFilledPrice: number; // estimated filled price / open price 預估成交價格
  fee: number;
  // value: number; // margin x leverage x price (USDT) = value (USDT)
}

export interface IUserBalance {
  available: number;
  locked: number;
  PNL: number;
  // walletBalance: number; // deposit required info
  // interest: number; // 入金的利息
}

export interface IMarket {
  availableTickers: ITickerItem[];
  // getTickers: (id: number) => ITickerData[]; // 拿到交易對清單

  isCFDTradable: boolean;
  tickerDetails: ITickerDetails;
  candlestickData: ICandlestick[]; // x 100

  getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料
  getCandlestickData: (props: {ticker: string; timeSpan: TimeSpanUnion}) => ICandlestick[]; // x 100

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}

// export interface ITransferProps {
//   walletBalance: number; // deposit required info
// }

export interface ITransferOption {
  label: string; // USDT
  content: string; // Tether
  // icon: string; // svg
  // fee: number; // TODO
}

export type TimeSpanUnion = '15s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export interface ICandlestick {
  timestamp: number;
  OHLC: number[]; // lottie locates the last one
  average: number;

  // nowPrice: number;

  // latestOHLC: number[];
  // volume: number;
}

export interface ITickerLineGraph {
  dataArray: number[]; // position item: at least x6, ticker item: at least x10
}

export interface IPositionLineGraph extends ITickerLineGraph {
  // id: string; // CFD id
  openPrice: number; // annotated value
}

export interface ITickerDetails {
  label: string;
  price: number;
  fluctuating: fluctuatingProps;
  volume: number; // 24 hr volume

  spread: number; // 點差 %
  fee: number; // 手續費
  guranteedStopFee: number; // 保證停損手續費
  // slippage: number; // 滑價
  estimatedFilledPrice: number; // price + spread = estimated filled price

  bullAndBearIndex: number; // BBI 多空指數
  priceData: IPriceData; // [5m, 60m, 1d]
  cryptoDetails: ICryptoDetails;
}

export interface IPriceData {
  fiveMin: {low: number; high: number; now: number}; // [low, high, now]
  sixtyMin: {low: number; high: number; now: number};
  oneDay: {low: number; high: number; now: number};
}

export interface ICryptoDetails {
  price: number;
  rank: number;
  publishTime: number;
  publishAmount: number; // circulatingSupply / totalSupply / maxSupply
  tradingVolume: number;
  totalValue: number; // marketCap
  tradingValue: number;

  introduction: string;
  whitePaper: string;
  website: string;
}

export interface fluctuatingProps {
  type: 'UP' | 'DOWN' | 'EQUAL';
  value: number;
  percentage: number;
}

export interface ITickerItem {
  currency: string; // token name
  chain: string;
  price: number;
  fluctuating: fluctuatingProps;

  starred: boolean; // TODO

  tokenImg: string;

  lineGraphProps: ITickerLineGraph;
}
