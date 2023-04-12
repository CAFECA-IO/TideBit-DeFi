import {ICode, Reason} from '../constants/code';

export class CustomError extends Error {
  code: ICode;

  constructor(code: ICode) {
    const message = Reason[code];
    super(message);
    this.code = code;
  }
}
