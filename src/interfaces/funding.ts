import { IProjectBelief } from "@/interfaces/project";

// Info: (20251212 - Julian) 用於首頁的 funding item 列表
export interface IFundingInfoBrief extends IProjectBelief {
  // Info: (20251212 - Julian) 已在 IProjectBelief 定義之項目
  // id, title, companyName, fundingStatus, coverImageId,
  // raisedFundingAmount, goalFundingAmount, raisedFundingAmount,
  // createdAt, startedAt, endedAt, remainingDays, fundingResult
  tokenName: string; // // Info: (20251212 - Julian) 代幣名稱
  tokenPrice: number; // Info: (20251212 - Julian) 代幣價格
  industry: string; // Info: (20251212 - Julian) 公司的產業類別，可能有固定選項，待確認
  committedFundAmount: number; // Info: (20251212 - Julian) 已承諾募資金額
  committedTokensCount: number; // Info: (20251212 - Julian) 已承諾代幣數量
  investorsCount: number; // Info: (20251212 - Julian) 投資人數
}

// Info: (20251212 - Julian) 用於首頁的 funding item
export interface IFundingItemUI extends IFundingInfoBrief {
  isCommitted: boolean; // Info: (20251212 - Julian) 標記使用者是否已經參與該募資
  isLocked: boolean; // Info: (20251212 - Julian) 標記該募資是否已鎖定（無法參與）
}

// Info: (20251212 - Julian) 預算明細項目，用於畫圓餅圖
interface IBudgetBreakdown {
  title: string;
  amount: number;
  percentage: number;
}

// Info: (20251212 - Julian) 募資預算摘要，和 `Budget Allocation` 通用
export interface IFundingBudgetSummary {
  totalFundingAmount: number;
  expenseAmount: number;
  remainAmount: number;
  breakdown: IBudgetBreakdown[]; // Info: (20251212 - Julian) 預算明細
}

// Info: (20251212 - Julian) 用於募資詳情頁的資訊
export interface IFundingInfoDetail extends IFundingInfoBrief {
  budgetSummary: IFundingBudgetSummary;
}

// Info: (20251212 - Julian) 募資介紹，用於 `Funding detail tab`
export interface IFundingIntroduction {
  introduction: string; // Info: (20251212 - Julian) 募資介紹，Markdown 格式
}

// Info: (20251212 - Julian) 財務報告，用於 `Funding financial report tab`
export interface IFinancialReport {
  balanceSheetUrl: string | null; // Info: (20251212 - Julian) 資產負債表連結
  incomeStatementUrl: string | null; // Info: (20251212 - Julian) 綜合損益表連結
  cashFlowStatementUrl: string | null; // Info: (20251212 - Julian) 現金流量表連結
  profitabilityAnalysisUrl: string | null; // Info: (20251212 - Julian) 獲利能力分析連結
}

// Info: (20251212 - Julian) 用於募資確認訂單 Modal
export interface IFundingConfirmOrderModalUI {
  tokenName: string;
  totalPrice: number;
  isReadAgreed: boolean;
}
