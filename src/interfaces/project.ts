import { ITeamBrief } from '@/interfaces/team';
import { FundingStatus, FundingResult } from '@/constants/funding';

// Info: (20251212 - Julian) 限定投資人：員工/股東
type InvestorType = 'employee' | 'shareholder';

// Info: (20251212 - Julian) 用於 Budget Categories Modal UI，選項須補上
type BudgetCategories =
  // ===== Operation =====
  'Product Management' | 'Employees' | 'Marketing' | 'Sales' | 'Customer Support';
// ===== Marketing =====
// ===== Sales =====
// ===== Product Development =====
// ===== Customer Support =====
// ===== Human Resources =====

// Info: (20251212 - Julian) 用於 Project item 列表 UI
export interface IProjectBelief {
  id: string;
  title: string; // Info: (20251212 - Julian) 專案標題
  companyName: string; // Info: (20251212 - Julian) 公司名稱
  fundingStatus: FundingStatus; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 募資狀態
  coverImageId: string; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 封面圖片 ID
  raisedFundingAmount: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 已募資金額
  goalFundingAmount: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 目標金額
  createdAt: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 專案建立時間戳
  startedAt: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 募資開始時間戳
  endedAt: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 募資結束時間戳
  remainingDays: number; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 剩餘天數
  fundingResult: FundingResult; // Info: (20251212 - Julian) // Info: (20251212 - Julian) 募資結果，Pending 為募資中
}

// Info: (20251212 - Julian) 用於 Project detail 頁面 UI
export interface IProjectDetail extends IProjectBelief {
  tokenName: string; // Info: (20251212 - Julian) 代幣名稱
  tokenPrice: number; // Info: (20251212 - Julian) 代幣價格
  committedTokensCount: number; // Info: (20251212 - Julian) 已承諾代幣數量
  investorsCount: number; // Info: (20251212 - Julian) 投資人數
  investorType: 'Public' | 'Private'; // Info: (20251212 - Julian) 目標投資者類型
  allowedInvestorTypes?: InvestorType[]; // Info: (20251212 - Julian) 允許的投資人類型，當 investorType 為 Private 時使用
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：投資人數折線圖資料
export interface ICommittedInvestorsChart {
  period: 'This Week'; // Info: (20251212 - Julian) 圖表區間，其他選項待補充
  graphData: {
    dateTimestamp: number; // Info: (20251212 - Julian) 日期時間戳
    committedInvestorsCount: number; // Info: (20251212 - Julian) 當日新增投資人數
  }[];
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：募資金額折線圖資料
export interface IFundsRaisedChart {
  period: 'This Week'; // Info: (20251212 - Julian) 圖表區間，其他選項待補充
  graphData: {
    dateTimestamp: number; // Info: (20251212 - Julian) 日期時間戳
    fundsRaisedAmount: number; // Info: (20251212 - Julian) 當日募資金額
  }[];
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：投資人分析長條圖資料
export interface ICommittedInvestorsBreakdownChart {
  graphData: {
    amountRange: '0 - 100' | '100 - 1K' | '1K - 10K' | '>10K'; // Info: (20251212 - Julian) 金額區間
    investorsCount: number; // Info: (20251212 - Julian) 投資人數
  }[];
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：前五大投資人資料
export interface ITopFiveInvestors {
  totalInvestorsCount: number; // Info: (20251212 - Julian) 總投資人數
  memberList: {
    id: string;
    name: string;
    avatarUrl: string | null;
    investedAmount: number; // Info: (20251212 - Julian) 投資金額
    investedPercentage: number; // Info: (20251212 - Julian) 投資比例
  }[];
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：Project news 列表
// Info: (20251212 - Julian) 使用 INewsBrief from ./news

// Info: (20251212 - Julian) 用於 Project detail 頁面：Project description block
export interface IProjectDescriptionBlock {
  description: string; // Info: (20251212 - Julian) 專案描述，Markdown 格式
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：Project document block
export interface IProjectDocumentBlock {
  documentList: {
    id: string;
    title: string;
    fileUrl: string;
  }[];
}

// Info: (20251212 - Julian) 用於 Project detail 頁面：Project budget allocation block
// Info: (20251212 - Julian) 使用 IProjectBudgetAllocation，如 145 行

// Info: (20251212 - Julian) 用於 Project detail 頁面：Project contact block
export interface IProjectContact {
  keyContactPerson: string;
  contactNumber: string;
  emailAddress: string;
}

// Info: (20251212 - Julian) ============ form UI interfaces ============
// Info: (20251212 - Julian) 用於 Project setting 表單 UI
export interface IProjectSetting {
  selectedTeam: ITeamBrief | null; // Info: (20251212 - Julian) 選擇的 Team
  goalAmount: number; // Info: (20251212 - Julian) 募資目標金額
  publicTimestamp: number; // Info: (20251212 - Julian) 預計公開時間戳
  publicPeriod: number; // Info: (20251212 - Julian) 預計公開期間 (天數)
  investorType: 'Public' | 'Private'; // Info: (20251212 - Julian) 目標投資者類型
  allowedInvestorTypes?: InvestorType[]; // Info: (20251212 - Julian) 允許的投資人類型，當 investorType 為 Private 時使用
  keyContactPerson?: string; // Info: (20251212 - Julian) 關鍵聯絡人姓名，可與 registered contact person 相同
  contactNumber: string;
  emailAddress: string;
}

// Info: (20251212 - Julian) 用於 Project upload document 表單 UI
export interface IProjectDocument {
  pictureOfKeyCompanyRepresentativePassport: string; // Info: (20251212 - Julian) 關鍵代表人身份證件圖片 ID
  pictureOfInvestmentAgreement: string; // Info: (20251212 - Julian) 投資協議圖片 ID
  financialReportsType: 'Upload manually' | 'Link to iSunFA'; // Info: (20251212 - Julian) 財務報告類型
  pictureOfBalanceSheet?: string; // Info: (20251212 - Julian) 資產負債表圖片 ID，當 financialReportsType 為 Upload manually 時使用
  pictureOfIncomeStatement?: string; // Info: (20251212 - Julian) 綜合損益表圖片 ID，當 financialReportsType 為 Upload manually 時使用
  pictureOfCashFlowStatement?: string; // Info: (20251212 - Julian) 現金流量表圖片 ID，當 financialReportsType 為 Upload manually 時使用
  accountBookCode?: string; // iSunFA 帳本代碼，當 financialReportsType 為 Link to iSunFA 時使用
}

// Info: (20251212 - Julian) 用於預算分配的單一項目 UI
export interface IBudgetLineItems {
  id: string;
  budgetCategories: BudgetCategories; // Info: (20251212 - Julian) 預算類別
  amount: number; // Info: (20251212 - Julian) 金額
  percentage: number; // Info: (20251212 - Julian) 百分比
}

// Info: (20251212 - Julian) 用於 Project budget allocation 表單 UI
export interface IProjectBudgetAllocation {
  budgetLineItems: IBudgetLineItems[];
}

// Info: (20251212 - Julian) 用於 Project Intro 表單 UI
export interface IProjectIntro {
  pictureOfProjectCover: string; // Info: (20251212 - Julian) 專案封面圖片 ID
  pictureOfIntroductionVideo: string | null; // Info: (20251212 - Julian) 專案介紹影片圖片 ID，可選
  description: string; // Info: (20251212 - Julian) 專案介紹，Markdown 格式
}

// Info: (20251212 - Julian) 由後端回傳的 Project payment 資訊
export interface IProjectPayment {
  initialLaunchFee: number; // Info: (20251212 - Julian) 初始上架費用
  monthlyFee: number; // Info: (20251212 - Julian) 每月平台使用費
  totalPayment: number; // Info: (20251212 - Julian) 總付款金額
}
