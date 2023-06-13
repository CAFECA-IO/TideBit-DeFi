export type IToastId = {
  WITHDRAW: string;
  DEPOSIT: string;
  GET_QUOTATION_ERROR: string;
  INVALID_CFD_OPEN_REQUEST: string;
  INCONSISTENT_TICKER_OF_QUOTATION: string;
};

export const ToastId: IToastId = {
  WITHDRAW: 'Withdraw_LoadingModalMinimized',
  DEPOSIT: 'Deposit_LoadingModalMinimized',
  GET_QUOTATION_ERROR: 'GetQuotationError',
  INVALID_CFD_OPEN_REQUEST: 'InvalidCFDOpenRequest',
  INCONSISTENT_TICKER_OF_QUOTATION: 'InconsistentTickerOfQuotation',
};
