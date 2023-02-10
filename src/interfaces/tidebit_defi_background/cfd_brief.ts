import {IPnL} from './pnl';

export interface ICFDBrief {
  id: string;
  amount: number;
  state: 'OPENING' | 'CLOSED';
  ticker: string; // 'BTC' | 'ETH'
  typeOfPosition: 'BUY' | 'SELL'; // 'Buy' | 'Sell'
  leverage: number;
  margin: number;
  openPrice: number; // Avg. Open Price 平均開倉價格
  takeProfit?: number;
  stopLoss?: number;
  recommendedTp: number; // Recommend the take profit price according to the position type
  recommendedSl: number;
  guaranteedStop: boolean;
  fee: number;
  guaranteedStopFee: number; // 保證止損費用
  openTimestamp: number;
  scheduledClosingTimestamp: number;
  openValue: number; // margin x leverage x price (USDT) = value (USDT)
  pnl: IPnL; // calculated by context
  liquidationPrice: number; // 強平價 / 清算水平 stop-out level
}
