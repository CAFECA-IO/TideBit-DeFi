import { IProjectBelief } from '@/interfaces/project';
import { FundingStatus, FundingResult } from '@/constants/funding';

// Info: (20251212 - Julian) 用於首頁的 funding item 列表
export interface IFundingInfoBrief extends IProjectBelief {
  // Info: (20251212 - Julian) 已在 IProjectBelief 定義之項目
  // id, title, companyName, fundingStatus, coverImageId,
  // raisedFundingAmount, goalFundingAmount, raisedFundingAmount,
  // createdAt, startedAt, endedAt, remainingDays, fundingResult
  tokenName: string; // Info: (20251212 - Julian) 代幣名稱
  tokenPrice: number; // Info: (20251212 - Julian) 代幣價格
  releasedTokensCount: number; // Info: (20251219 - Julian) 釋出的 Token 數量
  soldTokensCount: number; // Info: (20251219 - Julian) 售出的 Token 數量
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
  totalAmount: number; // 預算金額
  usedAmount: number; // 已使用預算金額
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

export const mockFundingItems: IFundingItemUI[] = [
  {
    id: 'f-01',
    title: 'GreenTech Innovations',
    companyName: 'GreenTech Co.',
    fundingStatus: FundingStatus.ON_GOING,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 500000,
    goalFundingAmount: 1000000,
    createdAt: 1780000000,
    startedAt: 1780500000,
    endedAt: 1783000000,
    remainingDays: 30,
    fundingResult: FundingResult.PENDING,
    tokenName: 'GTECH',
    tokenPrice: 42.19,
    soldTokensCount: 2200,
    releasedTokensCount: 3400,
    industry: 'Renewable Energy',
    committedFundAmount: 20000,
    committedTokensCount: 10000,
    investorsCount: 150,
    isCommitted: true,
    isLocked: false,
  },
  {
    id: 'f-02',
    title: 'Together for Elmary: from surviving to healing',
    companyName: 'Monday Foundation',
    fundingStatus: FundingStatus.UPCOMING,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 34500,
    goalFundingAmount: 50000,
    createdAt: 1780000000,
    startedAt: 1780500000,
    endedAt: 1783000000,
    remainingDays: 5,
    fundingResult: FundingResult.PENDING,
    tokenName: 'DEFE',
    tokenPrice: 27.4,
    soldTokensCount: 7333,
    releasedTokensCount: 120000,
    industry: 'Healthcare',
    committedFundAmount: 54500,
    committedTokensCount: 7800,
    investorsCount: 32,
    isCommitted: false,
    isLocked: false,
  },
  {
    id: 'f-03',
    title: 'Tech for Tomorrow: AI Innovations',
    companyName: 'FutureTech Inc.',
    fundingStatus: FundingStatus.ON_GOING,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 75000,
    goalFundingAmount: 750000,
    createdAt: 1775000000,
    startedAt: 1775500000,
    endedAt: 1778000000,
    remainingDays: 7,
    fundingResult: FundingResult.PENDING,
    tokenName: 'FTAI',
    tokenPrice: 55.75,
    soldTokensCount: 234323,
    releasedTokensCount: 2450000,
    industry: 'Technology',
    committedFundAmount: 33240000,
    committedTokensCount: 12342000,
    investorsCount: 220,
    isCommitted: false,
    isLocked: true,
  },
  {
    id: 'f-04',
    title: 'Defend Wildlife: Protecting Endangered Species',
    companyName: 'Wildlife Warriors',
    fundingStatus: FundingStatus.UPCOMING,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 84830,
    goalFundingAmount: 600000,
    createdAt: 1780000000,
    startedAt: 1780500000,
    endedAt: 1783000000,
    remainingDays: 20,
    fundingResult: FundingResult.PENDING,
    tokenName: 'WILD',
    tokenPrice: 281,
    soldTokensCount: 423334500,
    releasedTokensCount: 823450000,
    industry: 'Environmental Conservation',
    committedFundAmount: 3234832,
    committedTokensCount: 4234500,
    investorsCount: 21,
    isCommitted: false,
    isLocked: true,
  },
  {
    id: 'f-05',
    title: 'EduFuture: Revolutionizing Education with Technology',
    companyName: 'EduFuture Labs',
    fundingStatus: FundingStatus.CLOSED,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 120000,
    goalFundingAmount: 124392,
    createdAt: 1740500000,
    startedAt: 1740500000,
    endedAt: 1744000000,
    remainingDays: 0,
    fundingResult: FundingResult.SUCCESS,
    tokenName: 'EDU',
    tokenPrice: 95.5,
    soldTokensCount: 15300,
    releasedTokensCount: 25000,
    industry: 'Education Technology',
    committedFundAmount: 602000,
    committedTokensCount: 135000,
    investorsCount: 300,
    isCommitted: true,
    isLocked: false,
  },
  {
    id: 'f-06',
    title: 'Clean Water for All: Global Access Initiative',
    companyName: 'AquaAid',
    fundingStatus: FundingStatus.CLOSED,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 50000,
    goalFundingAmount: 300000,
    createdAt: 1740000000,
    startedAt: 1740000000,
    endedAt: 1742000000,
    remainingDays: 0,
    fundingResult: FundingResult.FAILED,
    tokenName: 'AQUA',
    tokenPrice: 15.25,
    soldTokensCount: 33000,
    releasedTokensCount: 54000,
    industry: 'Water Resources',
    committedFundAmount: 15000,
    committedTokensCount: 54000,
    investorsCount: 45,
    isCommitted: false,
    isLocked: true,
  },
  {
    id: 'f-07',
    title: 'Solar Future: Expanding Renewable Energy Access',
    companyName: 'Solar Solutions',
    fundingStatus: FundingStatus.CLOSED,
    coverImageId: '/elements/default_pic.png',
    raisedFundingAmount: 510000,
    goalFundingAmount: 500000,
    createdAt: 1780000000,
    startedAt: 1780500000,
    endedAt: 1783000000,
    remainingDays: 0,
    fundingResult: FundingResult.SUCCESS,
    tokenName: 'SOLAR',
    tokenPrice: 68.9,
    soldTokensCount: 32000,
    releasedTokensCount: 75000,
    industry: 'Renewable Energy',
    committedFundAmount: 88000,
    committedTokensCount: 127600,
    investorsCount: 85,
    isCommitted: true,
    isLocked: true,
  },
];

export const mockFundingDetail: IFundingInfoDetail = {
  ...mockFundingItems[6],
  budgetSummary: {
    totalFundingAmount: 1000000,
    expenseAmount: 600000,
    remainAmount: 400000,
    breakdown: [
      {
        title: 'Research and Development',
        totalAmount: 300000,
        usedAmount: 300000,
      },
      { title: 'Marketing', totalAmount: 200000, usedAmount: 45000 },
      { title: 'Operations', totalAmount: 100000, usedAmount: 0 },
    ],
  },
};

export const mockFundingIntroduction: IFundingIntroduction = {
  introduction: `# Effect comment font content prototype.

  Ethereum (ETH) was launched in 2015. Ethereum is a decentralized blockchain that supports smart contracts-essentially computer programs-that can automatically execute when certain conditions are met. The native cryptocurrency-essentially computer programs-of the platform is called ether or ethereum. Ethereum is divisible to 18 decimal places. There is currently no hard cap on the total supply of ETH.

  ![image](https://image.jpg)

  # List blur align effect arrange.

  Layer thumbnail comment resizing prototype outline select link. Share select fill frame figjam layout hand auto. Auto inspect boolean prototype text scale text move. Inspect rotate font share prototype font plugin distribute. Undo polygon team link vertical polygon variant blur. Italic auto clip rectangle layout arrow list outline flows. Mask image italic slice flows.
  Ipsum flows subtract invite device boolean draft. Flatten draft library frame plugin underline arrow overflow. Font arrange figma component asset object. Pixel pixel layer slice content variant editor. Image group figjam vector opacity figjam project hand. Pen thumbnail flatten arrange edit layout selection background. Layer italic inspect inspect link move list align shadow project. Fill list union pencil resizing link blur boolean. Flows background union editor mask align scrolling text ellipse union. Team opacity font style editor. Community list project invite stroke union team editor pen. Boolean export main text create star list selection pen.
  Ellipse blur editor image resizing. Layer content mask pen resizing comment ipsum resizing pencil. Blur slice polygon object selection device select outline thumbnail. Scale object underline figjam edit subtract team prototype. Ellipse pencil draft style team.

  Text group flows hand duplicate plugin ellipse component vertical arrow. Create mask flatten thumbnail background content rectangle. Pencil strikethrough scrolling pixel scale main. Library shadow overflow comment font link object pen line italic. Vector strikethrough component content rotate. Follower arrange scrolling strikethrough pencil content vector. Rotate opacity blur horizontal rectangle line plugin move background underline. Slice shadow variant ellipse link. Reesizing shadow strikethrough draft plugin select auto team. Horizontal select polygon frame rectangle device.

  ![image](https://image.jpg)

  # Link strikethrough component mask align. Share strikethrough link style rotate. Editor font.

  Library layout draft list opacity move. Ipsum ellipse bullet edit follower auto slice export. Plugin thumbnail content align boolean ipsum community text list. Stroke rotate auto component connection library effect. Pen undo prototype share project scale pen. Image plugin device scrolling italic create effect rectangle blur draft. Invite image hand plugin subtract vector move rectangle bullet. Reesizing thumbnail comment blur team. Variant asset edit mask mask project project.
  Flows inspect select project scrolling. Rectangle thumbnail frame prototype strikethrough. Overflow figjam arrow flatten figjam.`,
};
