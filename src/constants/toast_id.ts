export type IToastId = {
  WITHDRAW: string;
  DEPOSIT: string;
  GET_QUOTATION_ERROR: string;
};

export const ToastId: IToastId = {
  WITHDRAW: 'Withdraw_LoadingModalMinimized',
  DEPOSIT: 'Deposit_LoadingModalMinimized',
  GET_QUOTATION_ERROR: 'GetQuotationError',
};
