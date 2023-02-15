export type ICFDClosedType =
  | 'SCHEDULE'
  | 'FORCED_LIQUIDATION'
  | 'STOP_LOSS'
  | 'TAKE_PROFIT'
  | 'BY_USER';
export interface ICFDClosedTypeConstant {
  SCHEDULE: ICFDClosedType;
  FORCED_LIQUIDATION: ICFDClosedType;
  STOP_LOSS: ICFDClosedType;
  TAKE_PROFIT: ICFDClosedType;
  BY_USER: ICFDClosedType;
}
export const CFDClosedType: ICFDClosedTypeConstant = {
  SCHEDULE: 'SCHEDULE',
  FORCED_LIQUIDATION: 'FORCED_LIQUIDATION',
  STOP_LOSS: 'STOP_LOSS',
  TAKE_PROFIT: 'TAKE_PROFIT',
  BY_USER: 'BY_USER',
};
