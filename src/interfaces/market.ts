import { ITokenInfo } from "@/interfaces/token";

// Info: (20251212 - Julian) 用於 Market 頁面：Market Overview
export interface IMarketOverview {
  totalMarketCap: number;
  total24hVolume: number;
  marketSentimentData: {
    type: "Positive" | "Neutral" | "Negative";
    percentage: number;
  }[];
}

// Info: (20251212 - Julian) 用於 Market 頁面：Pending investments section 的單一項目
export interface ITokenItem extends ITokenInfo {
  twentyFourHourChange: number; // Info: (20251212 - Julian) 24 小時價格變動百分比
  twentyFourHourVolume: number; // Info: (20251212 - Julian) 24 小時交易量
  marketCap: number; // Info: (20251212 - Julian) 市值
  lastSevenDaysTrendData: {
    dateTimestamp: number; // Info: (20251212 - Julian) 日期時間戳
    price: number; // Info: (20251212 - Julian) 當日價格
  }[]; // Info: (20251212 - Julian) 過去七天的價格走勢數據
}

export interface ITokenItemUI extends ITokenItem {
  isStarred: boolean; // Info: (20251212 - Julian) 是否加入收藏
}

// Info: (20251212 - Julian) 用於 Token detail 頁面：K 線圖資料
export interface ITokenCandlestickChart {
  period: "Live" | "5m" | "15m" | "30m" | "1h" | "4h" | "12h" | "1d"; // Info: (20251212 - Julian) 圖表區間
  openPrice: number; // Info: (20251212 - Julian) 開盤價
  highPrice: number; // Info: (20251212 - Julian) 最高價
  lowPrice: number; // Info: (20251212 - Julian) 最低價
  closePrice: number; // Info: (20251212 - Julian) 收盤價
  twentyFourHourVolume: number; // Info: (20251212 - Julian) 24 小時交易量
  graphData: {
    dateTimestamp: number; // Info: (20251212 - Julian) 日期時間戳
    openPrice: number; // Info: (20251212 - Julian) 開盤價
    highPrice: number; // Info: (20251212 - Julian) 最高價
    lowPrice: number; // Info: (20251212 - Julian) 最低價
    closePrice: number; // Info: (20251212 - Julian) 收盤價
  }[]; // Info: (20251212 - Julian) K 線圖資料
}

// Info: (20251212 - Julian) 用於 Token detail 頁面：Order Book 資料
export interface ITokenTrade {
  id: string;
  price: number; // Info: (20251212 - Julian) 交易價格
  quantity: number; // Info: (20251212 - Julian) 交易量
  total: number; // Info: (20251212 - Julian) 總交易量
  timestamp: number; // Info: (20251212 - Julian) 交易時間戳
}

export interface ITokenOrderBook {
  bids: ITokenTrade[]; // Info: (20251212 - Julian) 買單
  asks: ITokenTrade[]; // Info: (20251212 - Julian) 賣單
}

// Info: (20251212 - Julian) 用於 Sidebar 的 trade tab
// Info: (20251212 - Julian) Swap trade 的代幣餘額資訊
export interface ITokenBalance {
  token: ITokenInfo; // Info: (20251212 - Julian) 交易的代幣資訊
  balance: string; // Info: (20251212 - Julian) 用戶持有的所有代幣餘額 (string decimal)
  availableBalance: string; // Info: (20251212 - Julian) 用戶可用的代幣餘額(扣掉鎖定/未確認) (string decimal)
}
