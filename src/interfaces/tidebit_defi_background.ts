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

  // getHistory: () => null;
}

export interface ICFD {
  id: string;
  ticker: string; // 'BTC' | 'ETH'
  operation: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  opendValue: number; // margin x leverage x price = value
  opendPrice: number;
  closedPrice?: number;

  pnl: number; // gained from context
  // trend: number[]; // gained from Market object
  state: 'OPENING' | 'CLOSED';

  closedType?: 'SCHEDULE' | 'STOP_OUT' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'BY_USER';
  forcedClosed: boolean;

  openTimestamp: number;

  scheduledClosingTimestamp: number;

  closedTimestamp?: number; // remaining hrs gained from context
  closedValue?: number;
  stopOutLevel: number; // 清算水平

  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
}

export interface IUserBalance {
  available: number;
  locked: number;
  PNL: number;
  // label: 'available' | 'locked' | 'PNL'; // 'Available' | 'Locked/Margin' | 'PNL'
  // balance: number;
}

export interface IMarket {
  // availableTickers: ITickerData[];
  getTickers: (id: number) => ITickerData[]; // 會拿到交易對清單

  isCFDTradable: boolean;

  getTicker: (id: number) => ITickerInfo; // 會拿到現在這個交易對的資料
  getCandlestickData: (props: {ticker: string; timeSpan: timeSpan}) => ICandlestick[]; // x 100
}

export type timeSpan = '15s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export interface ICandlestick {
  timestamp: number;
  OHLC: number[]; // x4
  average: number; // x1

  // nowPrice: number;

  // latestOHLC: number[];
  // volume: number;
}

export interface ITickerLineGraph {
  dataArray: number[]; // x10
  // price: number;
  // strokeColor
}

export interface IPositionLineGraph extends ITickerLineGraph {
  // id: string;
  openPrice: number; // annotated value
}

// [open, high, low, close] x 10
// [open, high, low, close] x 100

export interface ITickerInfo {
  label: string;
  price: number;
  fluctuating: fluctuatingProps;
  volume: number; // 24 hr volume
  spread: number; // 點差
  fee: number; // 手續費
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
  star: boolean;
  starred: boolean;
  // starColor: string;
  // getStarredStateCallback: (bool: boolean) => void;
  price: number;
  fluctuating: fluctuatingProps;
  // gradientColor: string;
  tokenImg: string;

  lineGraphProps: ILineGraphProps;
}

export interface ILineGraphProps {
  dataArray?: number[];
  strokeColor?: string[];
  lineGraphWidth?: string;
  lineGraphWidthMobile?: string;
}
