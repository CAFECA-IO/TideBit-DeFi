export type IToastId = {
  WITHDRAW: string;
  DEPOSIT: string;
  GET_QUOTATION_ERROR: string;
  INVALID_CFD_OPEN_REQUEST: string;
};

export const ToastId: IToastId = {
  WITHDRAW: 'Withdraw_LoadingModalMinimized',
  DEPOSIT: 'Deposit_LoadingModalMinimized',
  GET_QUOTATION_ERROR: 'GetQuotationError',
  INVALID_CFD_OPEN_REQUEST: 'InvalidCFDOpenRequest',
};
