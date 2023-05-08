import {Code, ICode, Reason} from '../../constants/code';
// import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {IAcceptedOrder} from './accepted_order';
import {IBalance} from './balance';
import {ICandlestickData} from './candlestickData';
import {ICryptocurrency} from './cryptocurrency';
import {IOrder} from './order';
import {IQuotation} from './quotation';
import {ITickerData} from './ticker_data';
import {ITickerHistoryData} from './ticker_history_data';
import {IUser} from './user';

export interface IResult {
  success: boolean;
  data?:
    | number
    | {user: IUser; expiredAt: string}
    | IBalance[]
    | IOrder[]
    | ICandlestickData[]
    | ITickerData[]
    | ICryptocurrency[]
    | IAcceptedOrder
    | IAcceptedOrder[]
    | {
        txhash: string;
        orderSnapshot: IOrder;
        balanceSnapshot: IBalance;
      }
    | {order: IOrder}
    | IQuotation
    | ITickerHistoryData[]
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
