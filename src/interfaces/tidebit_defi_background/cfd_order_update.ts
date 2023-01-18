export interface ICFDOrderUpdate {
  id: string;
  takeProfit?: number;
  stopLoss?: number;
  guranteedStop: boolean;
}
