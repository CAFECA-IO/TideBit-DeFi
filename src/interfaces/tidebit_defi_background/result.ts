import {Code, ICode, Reason} from '../../constants/code';
import {IAcceptedOrder} from './accepted_order';
import {IOrder} from './order';
import {IQuotation} from './quotation';
import {ITickerHistoryData} from './ticker_history_data';

export interface IResult {
  success: boolean;
  data?: IOrder[] | IAcceptedOrder | IQuotation | ITickerHistoryData[] | null;
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
  reason: Reason[Code.INTERNAL_SERVER_ERROR],
};
