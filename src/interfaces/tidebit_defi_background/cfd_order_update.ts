export interface ICFDOrderUpdateRequest {
  id: string;
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
}
