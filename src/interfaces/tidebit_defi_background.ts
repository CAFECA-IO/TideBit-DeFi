export interface IUser {
  id: string | null;
  username: string | null;
  email: string | null;
  wallet: string | null;
  favoriteTickers: ITickerData[];
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
  addFavoriteTicker: (props: ITickerData) => Promise<void>;
  removeFavoriteTicker: (props: ITickerData) => Promise<void>;

  balances: IUserBalance;
  getTotalBalace: () => IUserBalance;
  // getPnL: () => null;

  CFDs: ICFD[];
  getOpenedCFD: () => ICFD[];
  getClosedCFD: () => ICFD[];

  // 拿到歷史PnL紀錄
  // getHistory: () => null;

  createOrder: (props: ICFDOrderRequest) => Promise<ICFD>;
  closeOrder: (props: {id: string}) => Promise<ICFD>;
  updateOrder: (props: {
    id: string;
    takeProfit?: number;
    stopLoss?: number;
    guranteedStop: boolean;
  }) => Promise<ICFD>;
  // + createOrder(orderType<CFD, Deposite, Withdraw, SpotTrade>, data):PublicOrder
  deposit: (props: {asset: string; amount: number}) => Promise<TransferStateUnion>;
  withdraw: (props: {asset: string; amount: number}) => Promise<TransferStateUnion>;
}

export type TransferStateUnion = 'success' | 'cancellation' | 'fail';

export interface ICFD {
  id: string;
  ticker: string; // 'BTC' | 'ETH'
  operation: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;

  closedType?: 'SCHEDULE' | 'FORCED_LIQUIDATION' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;

  openTimestamp: number;

  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  // estimatedFilledPrice: number; // estimated filled price 預估成交價格
  openPrice: number; // Avg. Open Price 平均開倉價格
  closedPrice?: number;

  pnl: number; // calculated by context
  // trend: number[]; // gained from Market object
  state: 'OPENING' | 'CLOSED';

  closedTimestamp?: number; // remaining hrs gained from context
  closedValue?: number;
  liquidationPrice: number; // 強平價 / 清算水平 stop-out level

  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;

  fee: number; // TODO

  positionLineGraph: ITickerLineGraph;
  // positionLineGraph: (props: {openTimestamp: number; openPrice: number}) => ITickerLineGraph; //
}

export interface ICFDOrderRequest {
  ticker: string;
  operation: 'BUY' | 'SELL';
  leverage: number;
  margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  estimatedFilledPrice: number; // estimated filled price 預估成交價格
  fee: number; // TODO
  // value: number; // margin x leverage x price (USDT) = value (USDT)
}

export interface IUserBalance {
  available: number;
  locked: number;
  PNL: number;
  walletBalance: number; // deposit required info
  // label: 'available' | 'locked' | 'PNL'; // 'Available' | 'Locked/Margin' | 'PNL'
  // balance: number;
}

export interface IMarket {
  availableTickers: ITickerData[];
  getTickers: (id: number) => ITickerData[]; // 拿到交易對清單

  isCFDTradable: boolean;

  getTicker: (id: number) => ITickerDetails; // 拿到現在這個交易對的資料
  getCandlestickData: (props: {ticker: string; timeSpan: TimeSpanUnion}) => ICandlestick[]; // x 100

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}

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
  guranteedStopFee: boolean; // 保證停損手續費
  // slippage: number; // 滑價
  estimatedFilledPrice: number; // price + spread = estimated filled price
  bullAndBearIndex: number; // BBI 多空指數
  priceData: IPriceData; // [5m, 60m, 1d]
  cryptoDetails: ICryptoDetails;
}

export interface IPriceData {
  '5m': {low: number; high: number; now: number}; // [low, high, now]
  '60m': {low: number; high: number; now: number};
  '1d': {low: number; high: number; now: number};
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

// export const UserContext = createContext<IUserContext>({
//   id: null,
//   username: null,
//   email: null,
//   wallet: null,
//   favoriteTickers: [],
//   isSubscibedNewsletters: false,
//   isEnabledEmailNotification: false,
//   isConnected: false,
//   isConnectedWithEmail: false,
//   isConnectedWithTideBit: false,
//   walletId: null,
//   tideBitId: null,
//   enableServiceTerm: false,
//   connect: () => Promise.resolve(true),
//   disconnect: () => Promise.resolve(),
//   signServiceTerm: () => Promise.resolve(true),
//   addFavoriteTicker: (props: ITickerData) => Promise.resolve(),
//   removeFavoriteTicker: (props: ITickerData) => Promise.resolve(),
// });

export interface ITickerData {
  currency: string; // token name
  chain: string;
  price: number;
  fluctuating: fluctuatingProps;

  tokenImg: string;

  lineGraphProps: ITickerLineGraph;
}

// export interface ILineGraphProps {
//   dataArray?: number[];
//   strokeColor?: string[];
//   lineGraphWidth?: string;
//   lineGraphWidthMobile?: string;
// }
