export type IModifyType = 1 | 2 | 3 | 4;
export interface IModifyTypeConstant {
  COMMON: IModifyType;
  TAKE_PROFIT: IModifyType;
  STOP_LOSS: IModifyType;
  LIQUIDATION: IModifyType;
}

export const cfdStateCode = {
  LIQUIDATION: 1,
  STOP_LOSS: 2,
  TAKE_PROFIT: 3,
  COMMON: 4,
};
