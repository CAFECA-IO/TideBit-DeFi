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
  getWalletBalance: (asset: string) => number;
  // getTotalBalace: () => IUserBalance;
  // getPnL: () => null;

  // attribute 在前端用 useState 或用 const 來寫
  // CFDDetails: ICFDDetails;
  openCFDItems: IOpenCFDBrief[];
  closedCFDItems: IClosedCFDBrief[];
  positionsOnChart: ICFDBrief[];

  // function 用於不須及時更新的資料
  getOpenedCFD: (id: number) => IOpenCFDDetails[];
  getClosedCFD: (id: number) => IClosedCFDDetails[];

  createOrder: (props: ICFDOrderRequest) => Promise<IOrderStatusUnion>;
  closeOrder: (props: {id: string}) => Promise<IOrderStatusUnion>;
  updateOrder: (props: ICFDOrderUpdate) => Promise<IOrderStatusUnion>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
  deposit: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<IOrderStatusUnion>;

  notifications: INotification[];
  // getNotifications: () => INotification[];

  // -----------Ignores below----------------
  // 拿到所有withdraw / deposit / CFD 紀錄
  // receipts: IReceipt[];
  // getHistory: () => null;
  // + getHistory():Array<SignedOrder:SignedWithdraw, SingedDeposit, SignedCFD>
}

export type IOrderStatusUnion = 'processing' | 'success' | 'cancellation' | 'fail';

export interface ICFDOrderUpdate {
  id: string;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
}

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

export interface ICFDBrief {
  id: string;
  ticker: string;
  typeOfPosition: 'BUY' | 'SELL';
  openPrice: number;
  openValue: number;
  pNL: IPnL;
}

export interface IOpenCFDBrief extends ICFDBrief {
  remainingHrs: number;
  positionLineGraph: ITickerLineGraph;
}

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export interface INotification {
  id: string;
  timestamp: number;
  title: string;
  content: string;
}

// export interface IPNL {
//   profitOrLoss: number;
//   amount: number;
// }

export interface ICFDDetails {
  id: string;

  ticker: string; // 'BTC' | 'ETH'
  typeOfPosition: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
  fee: number;

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: IPnL; // calculated by context

  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}

export interface IOpenCFDDetails extends ICFDDetails {
  state: 'OPENING';
}

export interface IClosedCFDDetails extends ICFDDetails {
  state: 'CLOSED';
  closedType: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;
  closedTimestamp: number; // remaining hrs gained from context
  closedValue: number;
}

export interface ICFDOrderRequest {
  ticker: string;
  typeOfPosition: 'BUY' | 'SELL';
  leverage: number;
  margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
  estimatedFilledPrice: number; // estimated filled price / open price 預估成交價格
  fee: number;
  // value: number; // margin x leverage x price (USDT) = value (USDT) // TODO
}

export interface IUserBalance {
  available: number;
  locked: number;
  PNL: number; // TODO: IPnLProps
}

export interface IMarket {
  tickers: ITickerItem[];

  availableTickers: ITickerItem[];
  // getTickers: (id: number) => ITickerData[]; // 拿到交易對清單

  nowPrice: number;
  isCFDTradable: boolean;
  tickerDetails: ITickerDetails;
  candlestickData: ICandlestick[]; // x 100

  // home page
  // tideBitPromotion: ITideBitPromotion;
  // reserveInformation: IReserveInformation
  getTideBitPromotion: () => ITideBitPromotion;
  getReserveInformation: () => IReserve;

  // getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料
  getCandlestickData: (props: {ticker: string; timeSpan: ITimeSpanUnion}) => ICandlestick[]; // x 100

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}

export interface ITideBitPromotion {
  volume: number;
  users: number;
  fee: number;
}

export interface IReserve {
  asset: string;
  reserveRatio: number;
  totalDebt: number;
  totalAsset: number;
}

// export interface ITransferProps {
//   walletBalance: number; // deposit required info
// }

export interface ITransferOption {
  label: string; // USDT
  content: string; // Tether
  // icon: string; // svg
  fee: number;
}

export type ITimeSpanUnion = '15s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

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
  fluctuating: IFluctuating;
  volume: number; // 24 hr volume

  leverage: number;

  spread: number; // 點差 %
  fee: number; // 手續費
  guaranteedStopFee: number; // 保證停損手續費
  // slippage: number; // 滑價
  buyEstimatedFilledPrice: number; // price + spread = estimated filled price
  sellEstimatedFilledPrice: number; // price - spread = estimated filled price

  bullAndBearIndex: number; // BBI 多空指數
  priceData: IPriceStatistics; // [5m, 60m, 1d]
  cryptoSummary: ICryptoSummary;
  cryptoNews: IBriefNewsItem[];

  // cryptoDetails: ICryptoDetails;
  // news: (props: string) => IBriefNewsItem[];
}

export interface ICryptoSummary {
  icon: string; // TODO: wrap it with Image component
  label: string;
  introduction: string;
  whitePaperLink: string;
  websiteLink: string;

  price: string;
  rank: number;
  publishTime: string;
  publishAmount: string; // circulatingSupply / totalSupply / maxSupply
  tradingVolume: string;
  totalValue: string; // marketCap
  tradingValue: string;
}

export interface IBriefNewsItem {
  // id: string;
  // timestamp: number;
  // date: string;
  title: string;
  content: string;
  // link: string;
  img: string;
}

export interface IPriceStatistics {
  fiveMin: {low: number; high: number; now: string}; // now = [(now - low) / (high - low)] x 100
  sixtyMin: {low: number; high: number; now: string};
  oneDay: {low: number; high: number; now: string};
}

export interface IFluctuating {
  type: 'UP' | 'DOWN' | 'EQUAL';
  value: number;
  percentage: number;
}

export interface IPnL {
  type: 'UP' | 'DOWN' | 'EQUAL';
  value: number;
}

export interface ITickerItem {
  id: string;
  currency: string; // token name
  chain: string;
  price: number;
  fluctuating: IFluctuating;

  starred: boolean; // TODO

  tokenImg: string;

  lineGraph: ITickerLineGraph;
}
