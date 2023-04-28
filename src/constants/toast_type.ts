export type IToastType = 'success' | 'error' | 'warning' | 'info';

export type IToastTypeConstant = {
  SUCCESS: IToastType;
  ERROR: IToastType;
  WARNING: IToastType;
  INFO: IToastType;
};

export const ToastType: IToastTypeConstant = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const ToastTypeAndText = {
  SUCCESS: {
    type: ToastType.SUCCESS,
    text: 'TOAST.INFO',
  },
  ERROR: {
    type: ToastType.ERROR,
    text: 'TOAST.ERROR',
  },
  WARNING: {
    type: ToastType.WARNING,
    text: 'TOAST.WARNING',
  },
  INFO: {
    type: ToastType.INFO,
    text: 'TOAST.INFO',
  },
};
