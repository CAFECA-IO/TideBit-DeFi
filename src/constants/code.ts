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
  | '90000000'
  | '10210001'
  | '30110001'
  | '10110002'
  | '40230001'
  | '10110001';

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
  FUNCTION_NOT_IMPLEMENTED: ICode;
  ORDER_NOT_OPENING: ICode;
  CANNOT_GET_QUOTATION_FROM_CONTEXT: ICode;
  BALANCE_NOT_FOUND: ICode;
  LOCK_PROCEDURE_WRONG: ICode;
};

export type IReason = {
  [key in ICode]: string;
};

export const Code: ICodeConstant = {
  SUCCESS: '00000000',
  UNKNOWN_ERROR: '90000000',

  LOCK_PROCEDURE_WRONG: '10110001',
  FUNCTION_NOT_IMPLEMENTED: '10210001',
  CANNOT_GET_QUOTATION_FROM_CONTEXT: '10110002',

  ORDER_NOT_OPENING: '30110001',
  INVAILD_ORDER_INPUTS: '30420001',
  EXPIRED_QUOTATION_CANCELED: '30410002',
  EXPIRED_QUOTATION_FAILED: '30410003',
  INVAILD_INPUTS: '30410004',

  BALANCE_NOT_FOUND: '40230001', // 1. 用戶嘗試攻擊 2. 我們程式碼嚴重缺陷
  WALLET_IS_NOT_CONNECT: '40430001',
  SERVICE_TERM_DISABLE: '40430002',
  DEWT_IS_NOT_LEGIT: '40430003',
  REJECTED_SIGNATURE: '40430004',

  INTERNAL_SERVER_ERROR: '60220001',
};

export const Reason: IReason = {
  '00000000': 'success',
  '10110001': 'Lock procedure wrong',
  '10210001': 'Function not implemented',
  '10110002': 'Cannot get quotation from context',

  '30110001': 'Order is not opening',
  '30420001': 'Invalid order inputs',
  '30410002': 'Deal canceled due to expired quotation',
  '30410003': 'An order cannot be created from an expired quotation',
  '30410004': 'Invalid Inputs',

  '40230001': 'Balance not found',
  '40430001': 'Wallet is not connected',
  '40430002': 'Service term is not enabled',
  '40430003': 'Dewt is not legit',
  '40430004': 'Signature rejected by user',

  '60220001': 'Internal server error',

  '90000000': 'Unknown error',
};
