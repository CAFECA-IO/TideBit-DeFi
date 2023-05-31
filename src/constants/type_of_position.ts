export type ITypeOfPosition = 'BUY' | 'SELL';

export type ITypeOfPositionConstant = {
  BUY: ITypeOfPosition;
  SELL: ITypeOfPosition;
};

export const TypeOfPosition: ITypeOfPositionConstant = {
  BUY: 'BUY',
  SELL: 'SELL',
};
