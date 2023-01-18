export interface ITickerItem {
  id: string;
  currency: string; // token name
  chain: string;
  price: number;
  // fluctuating: IFluctuatingProps;

  // starred: boolean; // TODO

  // tokenImg: string;

  // lineGraphProps: ITickerLineGraph;
}
