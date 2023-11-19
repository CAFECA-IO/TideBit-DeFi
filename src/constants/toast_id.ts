export type IToastId = {
  WITHDRAW: string;
  DEPOSIT: string;
  GET_QUOTATION_ERROR: string;
  INVALID_CFD_OPEN_REQUEST: string;
  INCONSISTENT_TICKER_OF_QUOTATION: string;
  UNKNOWN_ERROR_IN_COMPONENT: string;
  COPY_SUCCESS: string;
  INADEQUATE_AVAILABLE_BALANCE: string;
  GET_GSL_PERCENT_ERROR: string;
};

export const ToastId: IToastId = {
  WITHDRAW: 'Withdraw_LoadingModalMinimized',
  DEPOSIT: 'Deposit_LoadingModalMinimized',
  GET_QUOTATION_ERROR: 'GetQuotationError',
  INVALID_CFD_OPEN_REQUEST: 'InvalidCFDOpenRequest',
  INCONSISTENT_TICKER_OF_QUOTATION: 'InconsistentTickerOfQuotation',
  UNKNOWN_ERROR_IN_COMPONENT: 'UnknownErrorInComponent',
  COPY_SUCCESS: 'CopySuccess',
  INADEQUATE_AVAILABLE_BALANCE: 'InadequateAvailableBalance',
  GET_GSL_PERCENT_ERROR: 'GetGslPerncetError',
};
