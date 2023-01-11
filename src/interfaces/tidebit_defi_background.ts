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

  balances: IUserBalance[];
  getTotalBalace: () => IUserBalance[];
  // getPnL: () => null;

  CFDs: ICFD[];
  getOpenedCFD: () => ICFD[];
  getClosedCFD: () => ICFD[];

  // getHistory: () => null;
}

export interface ICFD {
  // id: string;
  ticker: string; // 'BTC' | 'ETH'
  operation: 'buy' | 'sell'; // 'Buy' | 'Sell'
  // leverage: number;
  value: number;
  // pnl: number; // calculated by frontend
  // trend: number[]; // gained by Market
  closingTimestamp: number;
}

export interface IUserBalance {
  label: 'available' | 'locked' | 'PNL'; // 'Available' | 'Locked/Margin' | 'PNL'
  balance: number;
}

export interface IMarket {
  // availableTickers: ITickerData[];
  getTickers: (id: number) => ITickerData[]; // 會拿到交易對清單

  isCFDTradable: boolean;

  getTicker: (id: number) => ITickerInfo; // 會拿到現在這個交易對的資料
  getCandlestickData: (ticker: string, timeSpan: timeSpan) => ICandlestick[];
}

export type timeSpan = '15s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export interface ICandlestick {
  timestamp: number;
  OHLC: number[]; // [open, high, low, close] x 100
  average: number;

  nowPrice: number;

  latestOHLC: number[]; // [open, high, low, close] x 10
  // volume: number;
}

export interface ITickerInfo {
  label: string;
  price: number;
  fluctuating: fluctuatingProps;
  volume: number; // 24 hr volume
}

export interface fluctuatingProps {
  type: 'up' | 'down' | 'equal';
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
  fluctuating: number;
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
