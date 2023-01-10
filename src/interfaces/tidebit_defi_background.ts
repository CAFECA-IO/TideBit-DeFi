export interface IRealUser {
  //----- subscribe + 拿到資料 -----
  id: string;
  username: string;
  email?: string;
  wallet: string[];
  favoriteTickers: ITickerData[]; // 會拿到哪些是被star，要顯示在favorite tab的

  // 在navbar上的用戶餘額 會定期更新
  getTotalBalace: () => null;
  // key: string;
  // value: number;
  // Avbl. Margin

  // 在navbar上的PnL 會定期更新
  getPnL: () => null;

  // 在trade tab這邊的用戶餘額
  // getBalances;~~

  // 用戶還沒關倉的倉位
  getOpenedCFD: () => null;

  /*
   * time: timestamp; 前端拿到該倉位結束的時間，然後自己算出剩下多久
   * ticker: string;
   * 操作: string;
   * 倉位 value: string;
   * Pnl: number;
   * 走勢
   *
   */

  // 監聽一個user，判斷更新餘額或order狀態

  // 用戶已關倉的倉位
  getClosedCFD: () => null;

  // My assets
  getHistory: () => null;

  // 交易對清單要自己比對user跟market

  //----- 拿到資料-----
  // orderEngine: string; // 產生 EIP 712 / 出金入金 要的資料
  isSubscibedNewsletters: boolean;
  isEnabledEmailNotification: boolean;
  isConnected: boolean;
  isConnectedWithEmail: boolean;
  isConnectedWithTideBit: boolean;
  walletId: string;
  tideBitId: string;
  enableServiceTerm: boolean;

  //----- 功能 -----
  // 加追蹤清單
  addFavoriteTicker: (ticker: string) => void;
  // 移除追蹤清單
  removeFavoriteTicker: (ticker: string) => void;

  // 用戶開倉出金入金的功能要的資料格式
  createOrder: (order: IOrder) => null;

  // 用戶關倉的功能要的資料格式
  closeCFD: (order: IOrder) => null;

  // 用戶調整倉位的功能要的資料格式
  updateOrder: (order: IOrder) => null;

  // 用戶訂閱電子報
  subscribeNewsletters: () => null;
}

export interface IRealMarket {
  //----- subscribe + 拿到資料 -----
  // 下單區的點差
  // Ticker; // 有整個交易相關的物件資料

  // 交易對清單的線會更新
  availableTickers: ITickerData[];
  isCFDTradable: boolean;
  getTickers: (ticker: string) => ITickerData; // 會拿到哪些是被star的
  getTicker: (ticker: string) => ITickerData; // 會拿到現在這個交易對的資料

  // 只有Live會即時更新
  // 蠟燭圖資料，依照時間間隔，拿到資料，重問一次、重新subscribe，把時間間隔當參數放進去
  getCandlestickChartData: (ticker: string, interval: string) => ICandlestickChartData;

  // 折線圖資料，依照時間間隔，拿到資料，重問一次、重新subscribe，把時間間隔當參數放進去
  getTradingChartData: (ticker: string, interval: string) => ITradingChartData;

  //----- 拿到資料-----
}

export interface ITickerData {
  id: string;
}

export interface ICandlestickChartData {
  id: string;
}

export interface ITradingChartData {
  id: string;
}

export interface IOrder {
  id: string;
}
