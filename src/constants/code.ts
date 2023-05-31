export type ICode =
  | '00000000'
  | '10110001'
  | '10110002'
  | '10110003'
  | '10120001'
  | '10210001'
  | '10210002'
  | '10210003'
  | '10210004'
  | '10210005'
  | '10210006'
  | '10210007'
  | '10210008'
  | '10220001'
  | '10220002'
  | '10310001'
  | '10310002'
  | '20210001'
  | '30110001'
  | '30410002'
  | '30410003'
  | '30410004'
  | '30410005'
  | '30420001'
  | '40110001'
  | '40230001'
  | '40230002'
  | '40430001'
  | '40430002'
  | '40430003'
  | '40430004'
  | '60210001'
  | '60210002'
  | '60210003'
  | '60220001'
  | '60220002'
  | '60310001'
  | '80410001'
  | '90000000'
  | '90000001'
  | '60220002'
  | '40340005'
  | '60220003';

export type ICodeConstant = {
  SUCCESS: ICode;

  LOCK_PROCEDURE_WRONG: ICode;
  CANNOT_GET_QUOTATION_FROM_CONTEXT: ICode;
  NEED_ENABLE_SHARE_FUNCTION: ICode;
  CANNOT_FIND_CHAIN_BY_CURRENCY: ICode;
  FUNCTION_NOT_IMPLEMENTED: ICode;
  INSUFFICIENT_PREDICTED_TRADES: ICode;
  CFD_ORDER_NOT_FOUND: ICode;
  CFD_ORDER_STATE_ERROR: ICode;
  NEED_SHARE_URL: ICode;
  NEED_CFD_ORDER: ICode;
  CFD_ORDER_IS_ALREADY_CLOSED: ICode;
  CURRENCY_IS_NOT_TRADEBLE: ICode;
  INVAILD_FEE_CHARGE: ICode;
  BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER: ICode;
  BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER: ICode;
  THIRD_PARTY_LIBRARY_ERROR: ICode;

  FAILED_TO_CREATE_TRANSACTION: ICode;

  ORDER_NOT_OPENING: ICode;
  EXPIRED_QUOTATION_CANCELED: ICode;
  EXPIRED_QUOTATION_FAILED: ICode;
  INVAILD_INPUTS: ICode;
  UNABLE_TO_WITHDRAW_DUE_TO_POLICY: ICode;
  INVAILD_ORDER_INPUTS: ICode;

  HAS_NO_AUTHORITY: ICode;
  BALANCE_NOT_FOUND: ICode;
  FAILE_TO_UPDATE_BALANCE: ICode;
  WALLET_IS_NOT_CONNECT: ICode;
  SERVICE_TERM_DISABLE: ICode;
  DEWT_IS_NOT_LEGIT: ICode;
  REJECTED_SIGNATURE: ICode;

  INVALID_TRADE: ICode;
  CANNOT_FETCH_CFD_SHARE_ORDER: ICode;
  CFD_ORDER_NOT_MATCH: ICode;
  INTERNAL_SERVER_ERROR: ICode;
  INVAILD_QUOTATION: ICode;
  CANNOT_CONVERT_TO_IMAGE: ICode;

  DEPOSIT_TOO_FREQUENCY: ICode;
  INVALID_CFD_OPEN_REQUEST: ICode;
  FAILED_TO_VERIFY_SIGNATURE: ICode;

  UNKNOWN_ERROR: ICode;
  UNKNOWN_ERROR_IN_COMPONENT: ICode;
};

export type IReason = {
  [key in ICode]: string;
};

export const Code: ICodeConstant = {
  SUCCESS: '00000000',

  LOCK_PROCEDURE_WRONG: '10110001',
  CANNOT_GET_QUOTATION_FROM_CONTEXT: '10110002',
  NEED_ENABLE_SHARE_FUNCTION: '10110003',
  CANNOT_FIND_CHAIN_BY_CURRENCY: '10120001',
  FUNCTION_NOT_IMPLEMENTED: '10210001',
  INSUFFICIENT_PREDICTED_TRADES: '10210002',
  CFD_ORDER_NOT_FOUND: '10210003',
  CFD_ORDER_STATE_ERROR: '10210004',
  NEED_SHARE_URL: '10310002',
  NEED_CFD_ORDER: '10210005',
  CFD_ORDER_IS_ALREADY_CLOSED: '10210006',
  CURRENCY_IS_NOT_TRADEBLE: '10210007',
  INVAILD_FEE_CHARGE: '10210008',
  BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER: '10220001',
  BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER: '10220002',
  THIRD_PARTY_LIBRARY_ERROR: '10310001',

  FAILED_TO_CREATE_TRANSACTION: '20210001',

  ORDER_NOT_OPENING: '30110001',
  EXPIRED_QUOTATION_CANCELED: '30410002',
  EXPIRED_QUOTATION_FAILED: '30410003',
  INVAILD_INPUTS: '30410004',
  UNABLE_TO_WITHDRAW_DUE_TO_POLICY: '30410005',
  INVAILD_ORDER_INPUTS: '30420001',

  HAS_NO_AUTHORITY: '40110001',
  BALANCE_NOT_FOUND: '40230001',
  FAILE_TO_UPDATE_BALANCE: '40230002',
  WALLET_IS_NOT_CONNECT: '40430001',
  SERVICE_TERM_DISABLE: '40430002',
  DEWT_IS_NOT_LEGIT: '40430003',
  REJECTED_SIGNATURE: '40430004',
  FAILED_TO_VERIFY_SIGNATURE: '40340005',

  INVALID_TRADE: '60210001',
  CANNOT_FETCH_CFD_SHARE_ORDER: '60210002',
  CFD_ORDER_NOT_MATCH: '60210003',
  INTERNAL_SERVER_ERROR: '60220001',
  INVAILD_QUOTATION: '60220002',
  CANNOT_CONVERT_TO_IMAGE: '60310001',
  INVALID_CFD_OPEN_REQUEST: '60220002',

  DEPOSIT_TOO_FREQUENCY: '80410001',

  UNKNOWN_ERROR: '90000000',
  UNKNOWN_ERROR_IN_COMPONENT: '90000001',
};

export const Reason: IReason = {
  '00000000': 'ERROR_MESSAGE.SUCCESS',
  '10110001': 'ERROR_MESSAGE.LOCK_PROCEDURE_WRONG',
  '10110002': 'ERROR_MESSAGE.CANNOT_GET_QUOTATION_FROM_CONTEXT',
  '10110003': 'Need the shareEnable related function',
  '10120001': 'Chain name does not exist',
  '10210001': 'ERROR_MESSAGE.FUNCTION_NOT_IMPLEMENTED',
  '10210002': 'There are not enough predicted trades',
  '10210003': 'CFD order state error',
  '10210004': 'CFD order not found',
  '10210005': 'CFD order needed when sharing CFD to compare',
  '10210006': 'ERROR_MESSAGE.CFD_ORDER_IS_ALREADY_CLOSED',
  '10210007': 'ERROR_MESSAGE.CURRENCY_IS_NOT_TRADEBLE',
  '10210008': 'ERROR_MESSAGE.INVAILD_FEE_CHARGE',
  '10220001': 'ERROR_MESSAGE.BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER',
  '10220002': 'ERROR_MESSAGE.BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER',
  '10310001': 'ERROR_MESSAGE.THIRD_PARTY_LIBRARY_ERROR',
  '10310002': 'Cannot get share url',

  '20210001': 'ERROR_MESSAGE.FAILED_TO_CREATE_TRANSACTION',

  '30110001': 'ERROR_MESSAGE.ORDER_NOT_OPENING',
  '30410002': 'ERROR_MESSAGE.EXPIRED_QUOTATION_CANCELED',
  '30410003': 'ERROR_MESSAGE.EXPIRED_QUOTATION_FAILED',
  '30410004': 'ERROR_MESSAGE.INVAILD_INPUTS',
  '30410005': 'Unable to withdraw funds due to policy reasons',
  '30420001': 'ERROR_MESSAGE.INVAILD_ORDER_INPUTS',

  '40110001': 'ERROR_MESSAGE.HAS_NO_AUTHORITY',
  '40230001': 'ERROR_MESSAGE.BALANCE_NOT_FOUND',
  '40230002': 'ERROR_MESSAGE.FAILE_TO_UPDATE_BALANCE',
  '40430001': 'ERROR_MESSAGE.WALLET_IS_NOT_CONNECT',
  '40430002': 'ERROR_MESSAGE.SERVICE_TERM_DISABLE',
  '40430003': 'ERROR_MESSAGE.DEWT_IS_NOT_LEGIT',
  '40430004': 'ERROR_MESSAGE.REJECTED_SIGNATURE',
  '40340005': 'Failed to verify the signature of the request',

  '60210001': 'The format of trade is invalid',
  '60210002': 'Cannot fetch image url of Next API route',
  '60220001': 'ERROR_MESSAGE.INTERNAL_SERVER_ERROR',
  '60220002': 'ERROR_MESSAGE.INVAILD_QUOTATION',
  '60210003': 'CFD order are not consistent with the one got from API',
  '60220003': 'CFD information is invalid',
  '60310001': 'Cannot convert HTML to image',

  '80410001': 'Already deposit in a month',

  '90000000': 'ERROR_MESSAGE.UNKNOWN_ERROR',
  '90000001': 'ERROR_MESSAGE.UNKNOWN_ERROR_IN_COMPONENT',
};
