export type ICode =
  | '00000000'
  | '60220001'
  | '40430001'
  | '40430002'
  | '30410004'
  | '30420001'
  | '40430003'
  | '40430004'
  | '30410002'
  | '30410003'
  | '90000000';

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
  UNKNOWN_ERROR: ICode;
};

export type IReason = {
  [key in ICode]: string;
};

export const Code: ICodeConstant = {
  SUCCESS: '00000000',

  INVAILD_ORDER_INPUTS: '30420001', // ToDo: uncertain
  EXPIRED_QUOTATION_CANCELED: '30410002',
  EXPIRED_QUOTATION_FAILED: '30410003',

  INVAILD_INPUTS: '30410004',
  WALLET_IS_NOT_CONNECT: '40430001', // ToDo: uncertain
  SERVICE_TERM_DISABLE: '40430002', // ToDo: uncertain
  DEWT_IS_NOT_LEGIT: '40430003', // ToDo: uncertain
  REJECTED_SIGNATURE: '40430004', // ToDo: uncertain

  INTERNAL_SERVER_ERROR: '60220001',
  UNKNOWN_ERROR: '90000000',
};

export const Reason: IReason = {
  '00000000': 'success',

  '30420001': 'Invalid order inputs',
  '30410002': 'Deal canceled due to expired quotation',
  '30410003': 'An order cannot be created from an expired quotation',
  '30410004': 'Invalid Inputs',

  '40430001': 'Wallet is not connected',
  '40430002': 'Service term is not enabled',
  '40430003': 'Dewt is not legit',
  '40430004': 'Signature rejected by user',

  '60220001': 'Internal server error',

  '90000000': 'Unknown error',
};
