import {Code, ICode} from '../../constants/code';
import IJSON from '../ijson';

export interface IResult {
  success: boolean;
  data?: IJSON;
  code: ICode;
  reason?: string;
}

export const dummyResultSuccess: IResult = {
  success: true,
  code: Code.SUCCESS,
  data: null,
};

export const dummyResultFailed: IResult = {
  success: false,
  code: Code.INTERNAL_SERVER_ERROR,
  reason: 'Internal Server Error',
};
