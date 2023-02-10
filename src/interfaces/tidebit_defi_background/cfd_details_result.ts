import {dummyClosedCFDDetails, IClosedCFDDetails} from './closed_cfd_details';
import {dummyOpenCFDDetails, IOpenCFDDetails} from './open_cfd_details';
import {IResult} from './result';

export interface IOpenCFDDetailsResult extends IResult {
  data: IOpenCFDDetails | null;
}

export interface IClosedCFDDetailsResult extends IResult {
  data: IClosedCFDDetails | null;
}

export const dummySuccessOpenCFDDetailsResult: IOpenCFDDetailsResult = {
  success: true,
  data: dummyOpenCFDDetails,
};

export const dummySuccessClosedCFDDetailsResult: IClosedCFDDetailsResult = {
  success: true,
  data: dummyClosedCFDDetails,
};

export const dummyFailedOpenCFDDetailsResult: IOpenCFDDetailsResult = {
  success: false,
  data: null,
  reason: 'User is not Login',
};

export const dummyFailedClosedCFDDetailsResult: IClosedCFDDetailsResult = {
  success: false,
  data: null,
  reason: 'User is not Login',
};
