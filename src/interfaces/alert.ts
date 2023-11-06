export type IAlertStateType = 'WARNING' | 'ERROR';
export interface IAlertStateConstant {
  WARNING: IAlertStateType;
  ERROR: IAlertStateType;
}

export const AlertState: IAlertStateConstant = {
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export interface IAlertData {
  type: IAlertStateType;
  message: string;
}
