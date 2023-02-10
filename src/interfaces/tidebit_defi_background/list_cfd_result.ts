import {IResult} from './result';
import {dummyOpenCFDBrief, IOpenCFDBrief} from './open_cfd_brief';
import {dummyClosedCFDBrief, IClosedCFDBrief} from './closed_cfd_brief';

export interface IListOpenCFDResult extends IResult {
  data: IOpenCFDBrief[];
}
export interface IListClosedCFDResult extends IResult {
  data: IClosedCFDBrief[];
}
export const dummySuccessListOpenCFDBriefsResult: IListOpenCFDResult = {
  success: true,
  data: [dummyOpenCFDBrief],
};

export const dummySuccessListClosedCFDBriefsResult: IListClosedCFDResult = {
  success: true,
  data: [dummyClosedCFDBrief],
};

export const dummyFailedListOpenCFDBriefsResult: IListOpenCFDResult = {
  success: false,
  data: [],
  reason: 'User is not Login',
};

export const dummyFailedListClosedCFDBriefsResult: IListClosedCFDResult = {
  success: false,
  data: [],
  reason: 'User is not Login',
};
