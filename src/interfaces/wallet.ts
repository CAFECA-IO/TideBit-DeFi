import { TradeDirection, TransactionDirection } from "@/interfaces/trade";
import { IBankAccountDetail, ICreditCardDetail } from "@/interfaces/bank";
import { ITokenInfo } from "@/interfaces/token";

// Info: (20251212 - Julian) PnL 資訊
export interface IPnl {
  amount: number;
  profitLoss: number;
  profitLossSymbol: "+" | "-";
  percentage: number;
  currency: string; // Info: (20251212 - Julian) 貨幣單位
}

// Info: (20251212 - Julian) 用於 Wallet Overview 的 PNL 資訊
export interface IWalletPnl {
  today: IPnl;
  thirtyDays: IPnl;
  cumulative: IPnl;
}

// Info: (20251212 - Julian) 用於 Wallet Overview 的餘額資訊
export interface IWalletBalance {
  totalBalance: number; // Info: (20251212 - Julian) 用戶總餘額
  currency: string; // Info: (20251212 - Julian) 貨幣單位
  balanceChange: number; // Info: (20251212 - Julian) 餘額變動數量
}

// Info: (20251212 - Julian) 用於 Wallet Overview 的餘額變動折線圖資料
export interface IWalletBalanceChangeChart {
  period: "This Week"; // Info: (20251212 - Julian) 圖表區間，其他選項待補充
  graphData: {
    dateTimestamp: number; // Info: (20251212 - Julian) 日期時間戳
    balanceChangeAmount: number; // Info: (20251212 - Julian) 餘額變動數量
  }[];
}

// Info: (20251212 - Julian) 用於 Wallet overview，用戶持有的代幣項目
export interface IPortfolioTokenItem extends ITokenInfo {
  costBasisInUsd: number; // Info: (20251212 - Julian) 成本基礎價格 (USD)
  currentValueInUsd: number; // Info: (20251212 - Julian) 目前價值 (USD)
  returnInUsd: number; // Info: (20251212 - Julian) 投資報酬 (USD)
  returnPercentage: number; // Info: (20251212 - Julian) 投資報酬百分比
  returnSymbol: "+" | "-"; // Info: (20251212 - Julian) 投資報酬符號
  tokenImageColorHex?: string; // Info: (20251212 - Julian) 代幣圖標背景顏色，Hex 格式
}

// Info: (20251212 - Julian) 用於 Wallet overview，Token section 的「待處理投資項目」
export interface IWalletPendingTokenItem extends ITokenInfo {
  amount: number; // Info: (20251212 - Julian) 持有數量
  totalPriceInTwd: number; // Info: (20251212 - Julian) 總價值 (TWD)
  fundingRaisedAmount: number; // Info: (20251212 - Julian) 已募資金額 (TWD)
  fundingGoalAmount: number; // Info: (20251212 - Julian) 募資目標金額 (TWD)
  fundingProgress: number; // Info: (20251212 - Julian) 募資進度百分比
}

// Info: (20251212 - Julian) 用於 Wallet overview，Token section 的「已完成投資項目」
export interface IWalletCompletedTokenItem extends ITokenInfo {
  createdAt: number; // Info: (20251212 - Julian) 交易完成時間戳
  amount: number; // Info: (20251212 - Julian) 持有數量
  totalPriceInTwd: number; // Info: (20251212 - Julian) 總價值 (TWD)
  operation: "Success" | "Failed"; // Info: (20251212 - Julian) 交易結果
}

// Info: (20251212 - Julian) 用於 Wallet overview，Token section 的「開放訂單項目」
export interface IWalletOpenOrderTokenItem extends ITokenInfo {
  createAt: number; // Info: (20251212 - Julian) 訂單建立時間戳
  tradeDirection: TradeDirection; // Info: (20251212 - Julian) 買入或賣出
  quantity: number; // Info: (20251212 - Julian) 交易數量
  feeInTwd: number; // Info: (20251212 - Julian) 交易手續費 (TWD)
  totalPriceInTwd: number; // Info: (20251212 - Julian) 總價值 (TWD)
  operation: "Close"; // Info: (20251212 - Julian) 交易狀態，可能還有其他狀態待補充
}

// Info: (20251212 - Julian) 用於 Wallet overview，Token section 的「交易紀錄項目」
export interface IWalletTradingHistoryTokenItem extends ITokenInfo {
  createdAt: number; // Info: (20251212 - Julian) 交易完成時間戳
  tradeDirection: TradeDirection; // Info: (20251212 - Julian) 買入或賣出
  quantity: number; // Info: (20251212 - Julian) 交易數量
  feeInTwd: number; // Info: (20251212 - Julian) 交易手續費 (TWD)
  totalPriceInTwd: number; // Info: (20251212 - Julian) 總價值 (TWD)
  balance: number; // Info: (20251212 - Julian) 交易後餘額
}

// Info: (20251212 - Julian) 用於 Wallet overview，Token section 的「轉帳紀錄項目」
export interface IWalletTransactionHistoryTokenItem extends ITokenInfo {
  createdAt: number; // Info: (20251212 - Julian) 交易完成時間戳
  transactionDirection: TransactionDirection; // Info: (20251212 - Julian) 買入或賣出
  amount: number; // Info: (20251212 - Julian) 交易數量
  feeInTwd: number; // Info: (20251212 - Julian) 交易手續費 (TWD)
  fromOrTo: string; // Info: (20251212 - Julian) 交易對象
  status: "Success" | "Failed" | "Pending"; // Info: (20251212 - Julian) 交易狀態
  balance: number; // Info: (20251212 - Julian) 交易後餘額
}

// Info: (20251212 - Julian) 用於 Confirm Withdrawal Modal 的資訊
export interface IWithdrawalConfirming {
  tokenInfo: ITokenInfo; // Info: (20251212 - Julian) 出金的代幣
  bankAccount: IBankAccountDetail; // Info: (20251212 - Julian) 出金的銀行帳戶
  fee: number; // Info: (20251212 - Julian) 手續費
  balanceBeforeWithdraw: number; // Info: (20251212 - Julian) 出金前餘額
  balanceAfterWithdraw: number; // Info: (20251212 - Julian) 出金後餘額
}

// Info: (20251212 - Julian) ============ form UI interfaces ============
// Info: (20251212 - Julian) 用於 My Wallet / Deposit / Deposit via Bank
// Info: (20251212 - Julian) 新增銀行帳戶表單
export interface IAddBankAccountForm {
  bankCode: string; // Info: (20251212 - Julian) 銀行代碼
  bankAccountNumber: string; // Info: (20251212 - Julian) 銀行帳號
  accountName?: string; // Info: (20251212 - Julian) 用戶取的帳戶暱稱
}

// Info: (20251212 - Julian) 銀行帳戶資訊
export interface IBankAccount {
  id: string;
  bankCode: string; // Info: (20251212 - Julian) 銀行代碼
  bankAccountNumber: string; // Info: (20251212 - Julian) 銀行帳號
  accountName?: string; // Info: (20251212 - Julian) 用戶取的帳戶暱稱
  balance: number; // Info: (20251212 - Julian) 餘額
}

// Info: (20251212 - Julian) 透過銀行帳戶存入資金的表單
export interface IDepositViaBankForm {
  bankAccount: IBankAccount | null; // Info: (20251212 - Julian) 銀行帳戶
  depositAmount: number; // Info: (20251212 - Julian) 存入金額
}

// Info: (20251212 - Julian) 用於 My Wallet / Deposit / Deposit with card
export interface IAddCreditCardForm {
  creditCardNumber: string; // Info: (20251212 - Julian) 信用卡號碼
  expirationMonth: number; // Info: (20251212 - Julian) 到期月份
  expirationYear: number; // Info: (20251212 - Julian) 到期年份
  cvv: string; // Info: (20251212 - Julian) 安全碼
  cardHolderName: string; // Info: (20251212 - Julian) 持卡人姓名
  billingAddress: string; // Info: (20251212 - Julian) 帳單地址
}

// Info: (20251212 - Julian) 透過信用卡存入資金的表單
export interface IDepositViaCardForm {
  creditCard: ICreditCardDetail | null; // Info: (20251212 - Julian) 信用卡資訊
  depositAmount: number; // Info: (20251212 - Julian) 存入金額
}

// Info: (20251212 - Julian) 用於 My Wallet / Withdraw
// Info: (20251212 - Julian) 提取資金的表單
export interface IWithdrawForm {
  creditCard: ICreditCardDetail | null; // Info: (20251212 - Julian) 信用卡資訊
  withdrawAmount: number; // Info: (20251212 - Julian) 提取金額
}
