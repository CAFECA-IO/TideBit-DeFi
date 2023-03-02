export interface IQuotation {
  ticker: string;
  targetAsset: string;
  uniAsset: string;
  price: number;
  deadline: number;
  signature: string;
}
