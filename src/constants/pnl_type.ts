export type IPnLType = 'PROFIT' | 'LOSS' | 'EMPTY';

export type IPnLTypeConstant = {
  PROFIT: IPnLType;
  LOSS: IPnLType;
  EMPTY: IPnLType;
};

export const PnLType: IPnLTypeConstant = {
  PROFIT: 'PROFIT',
  LOSS: 'LOSS',
  EMPTY: 'EMPTY',
};
