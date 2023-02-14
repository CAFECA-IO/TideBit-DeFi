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
  price: number; // 點差包含市場滑價
  // fee: number;
  // value: number; // margin x leverage x price (USDT) = value (USDT)
}
