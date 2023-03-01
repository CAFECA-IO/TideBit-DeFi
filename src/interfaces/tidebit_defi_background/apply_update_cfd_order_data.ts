export interface IApplyUpdateCFDOrderData {
  orderId: string;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop?: boolean;
  guaranteedStopFee?: number;
}
