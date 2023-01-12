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
}

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
  getCandlestickData: (props: {ticker: string; timeSpan: timeSpan}) => ICandlestick[]; // x 100

  transferOptions: ITransferOption[]; // 可供入金出金的選項
}

export interface ITransferOption {
  label: string;
  content: string;
  // fee: number;
}

export type timeSpan = '15s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export interface ICandlestick {
  timestamp: number;
  OHLC: number[]; // lottie locates the last one
  average: number;

  // nowPrice: number;

  // latestOHLC: number[];
  // volume: number;
}

export interface ITickerLineGraph {
  dataArray: number[]; // at least x6
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
  spread: number; // 點差
  fee: number; // 手續費
  // slippage: number; // 滑價
  estimatedFilledPrice: number; // estimated filled price 預估成交價格
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
  currency: string;
  chain: string;
  // star: boolean;
  // starred: boolean;
  // starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: fluctuatingProps;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ITickerLineGraph;
}

// export interface ILineGraphProps {
//   dataArray?: number[];
//   strokeColor?: string[];
//   lineGraphWidth?: string;
//   lineGraphWidthMobile?: string;
// }
