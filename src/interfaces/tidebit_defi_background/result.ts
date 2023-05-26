import {Code, ICode, Reason} from '../../constants/code';
// import {IAcceptedCFDOrder} from './accepted_cfd_order';
import {IAcceptedOrder} from './accepted_order';
import {IBalance} from './balance';
import {ICandlestickData, ITrade} from './candlestickData';
import {ICryptocurrency} from './cryptocurrency';
import {IOrder} from './order';
import {IPersonalAchievement} from './personal_achievement';
import {IPersonalRanking} from './personal_ranking';
import {IQuotation} from './quotation';
import {ITickerData} from './ticker_data';
import {ITickerHistoryData} from './ticker_history_data';
import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITickerStatic} from './ticker_static';
import {ITideBitPromotion} from './tidebit_promotion';
import {IUser} from './user';
import {IUserAssets} from './user_assets';
import {IUserBalance} from './user_balance';
import {IWebsiteReserve} from './website_reserve';

export interface IResult {
  success: boolean;
  data?:
    | number
    | {user: IUser; expiredAt: string}
    | IBalance[]
    // | IUserBalance
    | IOrder[]
    | ICandlestickData[]
    | ITickerData[]
    | ICryptocurrency[]
    | IAcceptedOrder
    | IAcceptedOrder[]
    | {
        txhash: string;
        orderSnapshot: IOrder;
        balanceSnapshot: IBalance[];
      }
    | {order: IOrder}
    | IQuotation
    | ITickerHistoryData[]
    | ITickerStatic
    | ITickerLiveStatistics
    | ITrade[]
    | ITideBitPromotion
    | IWebsiteReserve
    | IUserAssets
    | IPersonalRanking
    | IPersonalAchievement
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
