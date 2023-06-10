export type IModifyType = 1 | 2 | 3 | 4;
export interface IModifyTypeConstant {
  COMMON: number;
  TAKE_PROFIT: number;
  STOP_LOSS: number;
  LIQUIDATION: number;
}

export const cfdStateCode = {
  TAKE_PROFIT: 1,
  STOP_LOSS: 2,
  LIQUIDATION: 3,
  COMMON: 4,
};
