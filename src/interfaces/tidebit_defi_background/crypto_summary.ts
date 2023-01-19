export interface ICryptoSummary {
  icon: string; // TODO: wrap it with Image component
  label: string;
  introduction: string;
  whitePaperLink: string;
  websiteLink: string;

  price: string;
  rank: number;
  publishTime: string;
  publishAmount: string; // circulatingSupply / totalSupply / maxSupply
  tradingVolume: string;
  totalValue: string; // marketCap
  tradingValue: string;
}
