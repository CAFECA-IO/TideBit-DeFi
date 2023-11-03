export type IAlertStateType = 'HEALTHY' | 'WARNING' | 'ERROR';
export interface IAlertStateConstant {
  HEALTHY: IAlertStateType;
  WARNING: IAlertStateType;
  ERROR: IAlertStateType;
}

export const AlertState: IAlertStateConstant = {
  HEALTHY: 'HEALTHY',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export interface IAlertData {
  type: IAlertStateType;
  message: string;
}
