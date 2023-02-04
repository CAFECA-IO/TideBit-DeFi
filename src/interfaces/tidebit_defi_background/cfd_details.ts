import {IPnL} from './pnl';

export interface ICFDDetails {
  id: string;

  amount: number;

  ticker: string; // 'BTC' | 'ETH'
  typeOfPosition: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  recommendedTp: number; // 若用戶沒有設定 takeProfit，則推薦的 takeProfit 點位
  recommendedSl: number;

  guranteedStop: boolean;
  fee: number;
  // guranteedStopAt: number; // 保證止損點位

  openTimestamp: number;
  scheduledClosingTimestamp: number;

  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: IPnL; // calculated by context

  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}
