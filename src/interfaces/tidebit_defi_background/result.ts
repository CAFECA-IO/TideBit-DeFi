export interface IResult {
  success: boolean;
  data?: any;
  reason?: string;
}

export const dummyResultSuccess: IResult = {
  success: true,
  data: null,
};

export const dummyResultFailed: IResult = {
  success: false,
  reason: 'Wallet is not connected',
};
