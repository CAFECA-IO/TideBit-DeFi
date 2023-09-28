export type ITypeOfValidation = 'TPSL' | 'TARGET';

export type IValidationConstant = {
  TPSL: ITypeOfValidation;
  TARGET: ITypeOfValidation;
};

export const TypeOfValidation: IValidationConstant = {
  TPSL: 'TPSL',
  TARGET: 'TARGET',
};
