import {IPnL} from './pnl';

export interface ICFDDetails {
  id: string;

  amount: string;

  ticker: string; // 'BTC' | 'ETH'
  typeOfPosition: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: string; // Avg. Open Price 平均開倉價格
  takeProfit?: string;
  stopLoss?: string;
  guranteedStop: boolean;
  fee: number;

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: IPnL; // calculated by context

  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}
