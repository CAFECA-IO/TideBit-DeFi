import { ITokenInfo } from '@/interfaces/token';

// Info: (20251212 - Julian) 交易方向：賣出/買入
export type TradeDirection = 'Sell' | 'Buy';

// Info: (20251212 - Julian) 交易方向：存入/提取
export type TransactionDirection = 'Deposit' | 'Withdraw';

// Info: (20251212 - Julian) 詢問 Swap trading 報價
export interface ISwapTradeRequest {
  tradeDirection: TradeDirection;
  fromToken: ITokenInfo;
  toToken: ITokenInfo;
  amount: string; // Info: (20251212 - Julian) 交易數量 (string decimal)
}

// Info: (20251212 - Julian) 取得 Swap trading 報價回應
export interface ISwapTradeResponse extends ITokenInfo {
  amount: string; // Info: (20251212 - Julian) 交易數量 (string decimal)
}

// Info: (20251212 - Julian) 用於 Confirm Swap Modal 的交易資訊
export interface ISwapTradeConfirming {
  tradeDirection: TradeDirection;
  fromToken: ITokenInfo;
  toToken: ITokenInfo;
  fee: string; // Info: (20251212 - Julian) 交易手續費 (string decimal)
  originalFromTokenBalance: string; // Info: (20251212 - Julian) 交易前的 fromToken 餘額 (string decimal)
  updatedFromTokenBalance: string; // Info: (20251212 - Julian) 交易後的 fromToken 餘額 (string decimal)
  originalToTokenBalance: string; // Info: (20251212 - Julian) 交易前的 toToken 餘額 (string decimal)
  updatedToTokenBalance: string; // Info: (20251212 - Julian) 交易後的 toToken 餘額 (string decimal)
  expiredAt: number; // Info: (20251212 - Julian) 交易報價過期時間戳
}

// Info: (20251212 - Julian) 詢問 Limit Order 報價
export interface ILimitOrderRequest {
  tradeDirection: TradeDirection;
  fromToken: ITokenInfo;
  toToken: ITokenInfo;
  amount: string; // Info: (20251212 - Julian) 交易數量 (string decimal)
  slippageTolerance: 'Market' | '+1%' | '+5%' | '+10%'; // Info: (20251212 - Julian) 價差容忍度
}

// Info: (20251212 - Julian) 取得 Limit Order 報價回應
export interface ILimitOrderResponse extends ITokenInfo {
  amount: string; // Info: (20251212 - Julian) 交易數量 (string decimal)
}

// Info: (20251212 - Julian) 用於 Confirm Limit Order Modal 的交易資訊
export interface ILimitOrderConfirming {
  tradeDirection: TradeDirection;
  triggerPrice: string; // Info: (20251212 - Julian) 觸發交易的價格 (string decimal)，'When iSunCoin is worth' 這行
  fromToken: ITokenInfo;
  toToken: ITokenInfo;
  fee: string; // Info: (20251212 - Julian) 交易手續費 (string decimal)
  totalPrice: string; // Info: (20251212 - Julian) 總交易價格 (string decimal)
}

// Info: (20251212 - Julian) 用於 Sidebar 的 Open order item 列表
export interface IOpenOrderItem {
  id: string;
  tradeDirection: TradeDirection; // Info: (20251212 - Julian) 買入或賣出
  fromToken: ITokenInfo;
  toToken: ITokenInfo;
  createdAt: number; // Info: (20251212 - Julian) 訂單建立時間戳
  price: string; // Info: (20251212 - Julian) 交易價格 (string decimal)
  // Info: (20251212 - Julian) 以下四欄需要再確認
  totalQuantity: string; // Info: (20251212 - Julian) 總交易數量 (string decimal)
  tradedQuantity: string; // Info: (20251212 - Julian) 已成交數量 (string decimal)
  totalPrice: string; // Info: (20251212 - Julian) 總交易價格 (string decimal)
  tradedPrice: string; // Info: (20251212 - Julian) 已成交價格 (string decimal)
}

// Info: (20251212 - Julian) 用於 Sidebar 的 Trade history item 列表
export interface ITradeHistoryItem {
  id: string;
  tradeDirection: TradeDirection; // Info: (20251212 - Julian) 買入或賣出
  endedAt: number; // Info: (20251212 - Julian) 交易完成時間戳
  tokenName: string; // Info: (20251212 - Julian) 代幣名稱
  price: string; // Info: (20251212 - Julian) 交易價格 (string decimal)
  quantity: string; // Info: (20251212 - Julian) 交易數量 (string decimal)
  totalPrice: string; // Info: (20251212 - Julian) 總交易價格 (string decimal)
}
