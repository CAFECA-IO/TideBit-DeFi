export type ICode =
  | '00000000'
  | '90000000'
  | '91000000'
  | '92000000'
  | '93000000'
  | '93100000'
  | '94000000'
  | '95000000'
  | '96000000'
  | '96100000'
  | '98000000'
  | '98100000'
  | '98200000'
  | '98300000'
  | '98400000'
  | '9A000000';

export type ICodeConstant = {
  SUCCESS: ICode;
  INTERNAL_SERVER_ERROR: ICode;
  WALLET_IS_NOT_CONNECT: ICode;
  SERVICE_TERM_DISABLE: ICode;
  INVAILD_INPUTS: ICode;
  INVAILD_ORDER_INPUTS: ICode;
  DEWT_IS_NOT_LEGIT: ICode;
  REJECTED_SIGNATURE: ICode;
  EXPIRED_QUOTATION_CANCELED: ICode;
  EXPIRED_QUOTATION_FAILED: ICode;
  CFD_OPEN_FAILED: ICode;
  CFD_UPDATED_FAILED: ICode;
  CFD_CLOSED_FAILED: ICode;
  WITHDRAWAL_FAILED: ICode;
  DEPOSIT_FAILED: ICode;
  UNKNOWN_ERROR: ICode;
};

export type IReason = {
  [key in ICode]: string;
};

export const Code: ICodeConstant = {
  SUCCESS: '00000000',
  INTERNAL_SERVER_ERROR: '90000000',
  WALLET_IS_NOT_CONNECT: '91000000',
  SERVICE_TERM_DISABLE: '92000000',
  INVAILD_INPUTS: '93000000',
  INVAILD_ORDER_INPUTS: '93100000',
  DEWT_IS_NOT_LEGIT: '94000000',
  REJECTED_SIGNATURE: '95000000',
  EXPIRED_QUOTATION_CANCELED: '96000000',
  EXPIRED_QUOTATION_FAILED: '96100000',
  CFD_OPEN_FAILED: '98000000',
  CFD_UPDATED_FAILED: '98100000',
  CFD_CLOSED_FAILED: '98200000',
  WITHDRAWAL_FAILED: '98300000',
  DEPOSIT_FAILED: '98400000',
  UNKNOWN_ERROR: '9A000000',
};

export const Reason: IReason = {
  '00000000': 'success',
  '90000000': 'Internal server error',
  '91000000': 'Wallet is not connected',
  '92000000': 'Service term is not enabled',
  '93000000': 'Invalid Inputs',
  '93100000': 'Invalid order inputs',
  '94000000': 'Dewt is not legit',
  '95000000': 'Signature rejected by user',
  '96000000': 'Expired quotation should not be sent to server',
  '96100000': 'An order cannot be created from an expired quotation',
  '98000000': 'Failed to open CFD',
  '98100000': 'Failed to update CFD',
  '98200000': 'Failed to close CFD',
  '98300000': 'Failed to withdraw',
  '98400000': 'Failed to deposit',
  '9A000000': 'Unknown error',
};
