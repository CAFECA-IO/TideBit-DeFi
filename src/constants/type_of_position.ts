export type ITypeOfPosition = 'BUY' | 'SELL';

export type ITypeOfPositionConstant = {
  [key: string]: ITypeOfPosition;
};

export const TypeOfPosition: ITypeOfPositionConstant = {
  BUY: 'BUY',
  SELL: 'SELL',
};
