export interface ICFDOrderCreatingProps {
  ticker: string;
  typeOfPosition: 'BUY' | 'SELL';
  leverage: number;
  positionValue: number;
  // margin: number;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
  guaranteedStopFee: number;
  estimatedFilledPrice: number; // estimated filled price / open price 預估成交價格
  // fee: number;
  // value: number; // margin x leverage x price (USDT) = value (USDT)
}
