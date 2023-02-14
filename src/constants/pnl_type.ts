import {type} from 'os';

export type IPnLType = 'PROFIT' | 'LOSS' | 'EMPTY';

export type IPnLTypeConstant = {
  [key: string]: IPnLType;
};

export const PnLType: IPnLTypeConstant = {
  PROFIT: 'PROFIT',
  LOSS: 'LOSS',
  EMPTY: 'EMPTY',
};
