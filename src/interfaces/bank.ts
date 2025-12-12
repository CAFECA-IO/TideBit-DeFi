// Info: (20251212 - Julian) 用戶的支付方式 - 銀行帳戶
export interface IBankAccountBelief {
  id: string;
  accountName: string; // Info: (20251212 - Julian) 用戶取的帳戶暱稱
  bankCode: string; // Info: (20251212 - Julian) 銀行代碼
  bankAccountNumberLast5Digits: string; // Info: (20251212 - Julian) 銀行帳號後五碼，用於顯示在 Bank Account/ Credit Card tab
}

export interface IBankAccountDetail extends IBankAccountBelief {
  bankAccountNumber: string; // Info: (20251212 - Julian) 銀行帳號完整號碼
}

// Info: (20251212 - Julian) 用戶的支付方式 - 信用卡
export interface ICreditCardBelief {
  id: string;
  bankName: string; // Info: (20251212 - Julian) 發卡銀行名稱
  creditCardLast4Digits: string; // Info: (20251212 - Julian) 信用卡後四碼，用於顯示在 Bank Account/ Credit Card tab
}

export interface ICreditCardDetail extends ICreditCardBelief {
  creditCard: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
  cardHolderName: string;
  billingAddress: string;
}
