export type IModifyType = 0 | 1 | 2 | 3;
export interface IModifyTypeConstant {
  COMMON: number;
  TAKE_PROFIT: number;
  STOP_LOSS: number;
  LIQUIDATION: number;
}

export const cfdStateCode = {
  COMMON: 0,
  TAKE_PROFIT: 1,
  STOP_LOSS: 2,
  LIQUIDATION: 3,
};
