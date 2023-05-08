export type IToastId = {
  WITHDRAW: string;
  DEPOSIT: string;
  GET_QUOTATION_ERROR_OPEN: string;
  GET_QUOTATION_ERROR_CLOSE: string;
};

export const ToastId: IToastId = {
  WITHDRAW: 'Withdraw_LoadingModalMinimized',
  DEPOSIT: 'Deposit_LoadingModalMinimized',
  GET_QUOTATION_ERROR_OPEN: 'OpenPosition_GetQuotationError',
  GET_QUOTATION_ERROR_CLOSE: 'ClosePosition_GetQuotationError',
};
