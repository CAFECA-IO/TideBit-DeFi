export type ICode = '00000000' | '90000000' | '91000000' | '92000000' | '93000000';

export type ICodeConstant = {
  SUCCESS: ICode;
  INTERNAL_SERVER_ERROR: ICode;
  WALLET_IS_NOT_CONNECT: ICode;
  SERVICE_TERM_DISABLE: ICode;
  INVAILD_INPUTS: ICode;
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
};

export const Reason: IReason = {
  '00000000': 'success',
  '90000000': 'Internal server error',
  '91000000': 'Wallet is not connected',
  '92000000': 'Service term is not enabled',
  '93000000': 'Invalid Inputs',
};
