export interface IResult {
  success: boolean;
  reason?: string;
}

export const dummySuccessResult: IResult = {
  success: true,
};

export const dummyFailedResult: IResult = {
  success: false,
  reason: 'User is not Login',
};
