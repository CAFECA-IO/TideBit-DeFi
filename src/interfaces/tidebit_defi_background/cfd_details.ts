import {IPnL} from './pnl';

export interface ICFDDetails {
  id: string;

  ticker: string; // 'BTC' | 'ETH'
  operation: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
  fee: number;

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: IPnL; // calculated by context

  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}
