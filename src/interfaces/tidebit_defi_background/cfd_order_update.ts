export interface ICFDOrderUpdateRequest {
  id: string;
  takeProfit?: number;
  stopLoss?: number;
  guaranteedStop: boolean;
}
