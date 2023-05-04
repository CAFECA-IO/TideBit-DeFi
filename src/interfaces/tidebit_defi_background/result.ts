import {Code, ICode, Reason} from '../../constants/code';
import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {IAcceptedOrder} from './accepted_order';
import {ICryptocurrency} from './cryptocurrency';
import {ISharingOrder} from './display_accepted_cfd_order';
import {IOrder} from './order';
import {IQuotation} from './quotation';
import {ITickerData} from './ticker_data';
import {ITickerHistoryData} from './ticker_history_data';

export interface IResult {
  success: boolean;
  data?:
    | number
    | ITickerData[]
    | ICryptocurrency[]
    | IAcceptedOrder
    | IAcceptedOrder[]
    | {order: IOrder; acceptedOrder: IAcceptedOrder}
    | IQuotation
    | ITickerHistoryData[]
    | ISharingOrder
    | null;
  code: ICode;
  reason?: string;
}

export const defaultResultSuccess: IResult = {
  success: true,
  code: Code.SUCCESS,
  data: null,
};

export const defaultResultFailed: IResult = {
  success: false,
  code: Code.INTERNAL_SERVER_ERROR,
  reason: Reason[Code.INTERNAL_SERVER_ERROR],
};
