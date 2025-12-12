// 限定投資人：員工/股東
type InvestorType = "employee" | "shareholder";

// Info: (20251212 - Julian) 用於 Project item 列表 UI
export interface IProjectBelief {
  id: string;
  title: string; // // Info: (20251212 - Julian) 專案標題
  companyName: string; // // Info: (20251212 - Julian) 公司名稱
  fundingStatus: "On-going" | "Upcoming" | "Closed"; // // Info: (20251212 - Julian) 募資狀態
  coverImageId: string; // // Info: (20251212 - Julian) 封面圖片 ID
  raisedFundingAmount: number; // // Info: (20251212 - Julian) 已募資金額
  goalFundingAmount: number; // // Info: (20251212 - Julian) 目標金額
  createdAt: number; // // Info: (20251212 - Julian) 專案建立時間戳
  startedAt: number; // // Info: (20251212 - Julian) 募資開始時間戳
  endedAt: number; // // Info: (20251212 - Julian) 募資結束時間戳
  remainingDays: number; // // Info: (20251212 - Julian) 剩餘天數
  fundingResult: "Success" | "Failed" | "Pending"; // // Info: (20251212 - Julian) 募資結果，Pending 為募資中
}

// Info: (20251212 - Julian) 用於 Project detail 頁面 UI
export interface IProjectDetail extends IProjectBelief {
  tokenName: string; // Info: (20251212 - Julian) 代幣名稱
  tokenPrice: number; // Info: (20251212 - Julian) 代幣價格
  committedTokensCount: number; // Info: (20251212 - Julian) 已承諾代幣數量
  investorsCount: number; // Info: (20251212 - Julian) 投資人數
  investorType: "Public" | "Private"; // Info: (20251212 - Julian) 目標投資者類型
  allowedInvestorTypes?: InvestorType[]; // Info: (20251212 - Julian) 允許的投資人類型，當 investorType 為 Private 時使用
}
