export type ICFDClosedType =
  | 'SCHEDULE'
  | 'FORCED_LIQUIDATION'
  | 'STOP_LOSS'
  | 'TAKE_PROFIT'
  | 'BY_USER';
export interface ICFDClosedTypeConstant {
  [key: string]: ICFDClosedType;
}
export const CFDClosedType: ICFDClosedTypeConstant = {
  SCHEDULE: 'SCHEDULE',
  FORCED_LIQUIDATION: 'FORCED_LIQUIDATION',
  STOP_LOSS: 'STOP_LOSS',
  TAKE_PROFIT: 'TAKE_PROFIT',
  BY_USER: 'BY_USER',
};
