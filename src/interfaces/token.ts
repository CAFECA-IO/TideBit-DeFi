// Info: (20251212 - Julian) Token 基本資訊
export interface ITokenInfo {
  id: string;
  tokenName: string; // Info: (20251212 - Julian) e.g. "ETH", "USDC"
  companyName: string; // Info: (20251212 - Julian) 公司名稱
  tokenLogoId: string; // Info: (20251212 - Julian) 代幣圖標
  priceInUsd: number; // Info: (20251212 - Julian) 代幣價格 (USD)
  priceInTwd: number; // Info: (20251212 - Julian) 代幣價格 (TWD)
}

// Info: (20251212 - Julian) 用於 Token detail 頁面：About 資訊
export interface ITokenDetail extends ITokenInfo {
  information: string; // Info: (20251212 - Julian) 代幣資訊
  whitepaperUrl: string; // Info: (20251212 - Julian) 白皮書連結
  websiteUrl: string; // Info: (20251212 - Julian) 官方網站連結
  rank: number; // Info: (20251212 - Julian) 代幣排名
  publishTimestamp: number; // Info: (20251212 - Julian) 發行時間戳
  publishAmount: number; // Info: (20251212 - Julian) 發行總量
  tradingVolume: number; // Info: (20251212 - Julian) 交易量
  totalValue: number; // Info: (20251212 - Julian) 總價值
  tradingValue: number; // Info: (20251212 - Julian) 交易價值
}
