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
  // value: number; // margin x leverage x price (USDT) = value (USDT) // TODO
}
