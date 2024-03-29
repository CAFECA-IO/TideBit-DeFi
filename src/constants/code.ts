export type ICode =
  | '00000000'
  | '10110001'
  | '10110002'
  | '10110003'
  | '10110004'
  | '10120001'
  | '10210001'
  | '10210002'
  | '10210003'
  | '10210004'
  | '10210005'
  | '10210006'
  | '10210007'
  | '10210008'
  | '10210009'
  | '10220001'
  | '10220002'
  | '10220003'
  | '10220004'
  | '10310001'
  | '10310002'
  | '20210001'
  | '30110001'
  | '30410001'
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
  | '40340005'
  | '60210001'
  | '60210002'
  | '60210003'
  | '60220001'
  | '60220002'
  | '60220003'
  | '60310001'
  | '80410001'
  | '80410002'
  | '90000000'
  | '90000001';

export type ICodeConstant = {
  SUCCESS: ICode;

  LOCK_PROCEDURE_WRONG: ICode;
  CANNOT_GET_QUOTATION_FROM_CONTEXT: ICode;
  NEED_ENABLE_SHARE_FUNCTION: ICode;
  INCONSISTENT_TICKER_OF_QUOTATION: ICode;
  CANNOT_FIND_CHAIN_BY_CURRENCY: ICode;
  FUNCTION_NOT_IMPLEMENTED: ICode;
  INSUFFICIENT_PREDICTED_TRADES: ICode;
  CFD_ORDER_NOT_FOUND: ICode;
  CFD_ORDER_STATE_ERROR: ICode;
  NEED_SHARE_URL: ICode;
  NEED_CFD_ORDER: ICode;
  CFD_ORDER_IS_ALREADY_CLOSED: ICode;
  CURRENCY_IS_NOT_TRADEBLE: ICode;
  CURRENCY_IS_NOT_ENABLE_DEPOSIT: ICode;
  INVAILD_FEE_CHARGE: ICode;
  BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER: ICode;
  BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER: ICode;
  MARGIN_IS_NOT_ENOUGH: ICode;
  BALANCE_IS_NOT_ENOUGH_TO_UPDATE_ORDER: ICode;
  THIRD_PARTY_LIBRARY_ERROR: ICode;

  FAILED_TO_CREATE_TRANSACTION: ICode;

  ORDER_NOT_OPENING: ICode;
  INADEQUATE_AVAILABLE_BALANCE: ICode;
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
  FAILED_TO_VERIFY_SIGNATURE: ICode;

  INVALID_TRADE: ICode;
  CANNOT_FETCH_CFD_SHARE_ORDER: ICode;
  CFD_ORDER_NOT_MATCH: ICode;
  INTERNAL_SERVER_ERROR: ICode;
  INVAILD_QUOTATION: ICode;
  CANNOT_CONVERT_TO_IMAGE: ICode;
  INVALID_CFD_OPEN_REQUEST: ICode;

  DEPOSIT_INTERVAL_TOO_SHORT: ICode;
  BADGE_ALREADY_EXIST: ICode;

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
  INCONSISTENT_TICKER_OF_QUOTATION: '10110004',
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
  CURRENCY_IS_NOT_ENABLE_DEPOSIT: '10210009',
  BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER: '10220001',
  BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER: '10220002',
  MARGIN_IS_NOT_ENOUGH: '10220003',
  BALANCE_IS_NOT_ENOUGH_TO_UPDATE_ORDER: '10220004',
  THIRD_PARTY_LIBRARY_ERROR: '10310001',

  FAILED_TO_CREATE_TRANSACTION: '20210001',

  ORDER_NOT_OPENING: '30110001',
  INADEQUATE_AVAILABLE_BALANCE: '30410001',
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
  INVALID_CFD_OPEN_REQUEST: '60220003',

  DEPOSIT_INTERVAL_TOO_SHORT: '80410001',
  BADGE_ALREADY_EXIST: '80410002',

  UNKNOWN_ERROR: '90000000',
  UNKNOWN_ERROR_IN_COMPONENT: '90000001',
};

export const Reason: IReason = {
  '00000000': 'ERROR_MESSAGE.SUCCESS',
  '10110001': 'ERROR_MESSAGE.LOCK_PROCEDURE_WRONG',
  '10110002': 'ERROR_MESSAGE.CANNOT_GET_QUOTATION_FROM_CONTEXT',

  '10110003': 'ERROR_MESSAGE.SHARE_ENABLE_FUNCTION_REQUIRED',
  '10110004': 'ERROR_MESSAGE.INCONSISTENT_QUOTATION_TICKER',
  '10120001': 'ERROR_MESSAGE.CHAIN_NAME_NOT_EXIST',

  '10210001': 'ERROR_MESSAGE.FUNCTION_NOT_IMPLEMENTED',

  '10210002': 'ERROR_MESSAGE.INSUFFICIENT_PREDICTED_TRADES',
  '10210003': 'ERROR_MESSAGE.CFD_ORDER_STATE_ERROR',
  '10210004': 'ERROR_MESSAGE.CFD_ORDER_NOT_FOUND',
  '10210005': 'ERROR_MESSAGE.CFD_ORDER_REQUIRED_FOR_COMPARISON',

  '10210006': 'ERROR_MESSAGE.CFD_ORDER_IS_ALREADY_CLOSED',
  '10210007': 'ERROR_MESSAGE.CURRENCY_IS_NOT_TRADEBLE',
  '10210008': 'ERROR_MESSAGE.INVAILD_FEE_CHARGE',
  '10210009': 'ERROR_MESSAGE.CURRENCY_IS_NOT_ENABLE_DEPOSIT',
  '10220001': 'ERROR_MESSAGE.BALANCE_IS_NOT_ENOUGH_TO_OPEN_ORDER',
  '10220002': 'ERROR_MESSAGE.BALANCE_IS_NOT_ENOUGH_TO_CLOSE_ORDER',
  '10220003': 'ERROR_MESSAGE.MARGIN_IS_NOT_ENOUGH',
  '10220004': 'ERROR_MESSAGE.BALANCE_IS_NOT_ENOUGH_TO_UPDATE_ORDER',
  '10310001': 'ERROR_MESSAGE.THIRD_PARTY_LIBRARY_ERROR',

  '10310002': 'ERROR_MESSAGE.UNABLE_TO_RETRIEVE_SHARE_URL',

  '20210001': 'ERROR_MESSAGE.FAILED_TO_CREATE_TRANSACTION',

  '30110001': 'ERROR_MESSAGE.ORDER_NOT_OPENING',
  '30410001': 'ERROR_MESSAGE.INADEQUATE_AVAILABLE_BALANCE',
  '30410002': 'ERROR_MESSAGE.EXPIRED_QUOTATION_CANCELED',
  '30410003': 'ERROR_MESSAGE.EXPIRED_QUOTATION_FAILED',
  '30410004': 'ERROR_MESSAGE.INVAILD_INPUTS',

  '30410005': 'ERROR_MESSAGE.WITHDRAWAL_BLOCKED_BY_POLICY',

  '30420001': 'ERROR_MESSAGE.INVAILD_ORDER_INPUTS',

  '40110001': 'ERROR_MESSAGE.HAS_NO_AUTHORITY',
  '40230001': 'ERROR_MESSAGE.BALANCE_NOT_FOUND',
  '40230002': 'ERROR_MESSAGE.FAILE_TO_UPDATE_BALANCE',
  '40430001': 'ERROR_MESSAGE.WALLET_IS_NOT_CONNECT',
  '40430002': 'ERROR_MESSAGE.SERVICE_TERM_DISABLE',
  '40430003': 'ERROR_MESSAGE.DEWT_IS_NOT_LEGIT',
  '40430004': 'ERROR_MESSAGE.REJECTED_SIGNATURE',

  '40340005': 'ERROR_MESSAGE.FAILED_TO_VERIFY_REQUEST_SIGNATURE',

  '60210001': 'ERROR_MESSAGE.INVALID_TRADE_FORMAT',
  '60210002': 'ERROR_MESSAGE.UNABLE_TO_FETCH_IMAGE_URL',

  '60220001': 'ERROR_MESSAGE.INTERNAL_SERVER_ERROR',
  '60220002': 'ERROR_MESSAGE.INVAILD_QUOTATION',

  '60210003': 'ERROR_MESSAGE.CFD_ORDER_INCONSISTENT_WITH_API',
  '60220003': 'ERROR_MESSAGE.INVALID_CFD_INFORMATION',
  '60310001': 'ERROR_MESSAGE.HTML_TO_IMAGE_CONVERSION_FAILED',

  '80410001': 'ERROR_MESSAGE.DEPOSIT_INTERVAL_TOO_SHORT', //'Deposit interval too short, you can deposit at most 1 times in 24 hours, please try again later',
  '80410002': 'ERROR_MESSAGE.BADGE_ALREADY_EXIST', //'Badge already exist

  '90000000': 'ERROR_MESSAGE.UNKNOWN_ERROR',
  '90000001': 'ERROR_MESSAGE.UNKNOWN_ERROR_IN_COMPONENT',
};
