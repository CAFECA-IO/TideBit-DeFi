import {Code, ICode, Reason} from '../../constants/code';
import {IAcceptedOrder} from './accepted_order';
import {IBadge} from './badge';
import {IBalance} from './balance';
import {ICandlestick} from './candlestick';
import {ICandlestickData, IInstCandlestick, ITrade} from './candlestickData';
import {ICryptocurrency} from './cryptocurrency';
import {ILeaderboard, IRanking} from './leaderboard';
import {IDepositOrder, IOrder} from './order';
import {IPersonalAchievement} from './personal_achievement';
import {IQuotation} from './quotation';
import {ITickerData} from './ticker_data';
import {ITickerHistoryData} from './ticker_history_data';
import {ITickerLiveStatistics} from './ticker_live_statistics';
import {ITickerStatic} from './ticker_static';
import {ITideBitPromotion} from './tidebit_promotion';
import {IUser} from './user';
import {IUserAssets} from './user_assets';
import {IWebsiteReserve} from './website_reserve';

export interface IResult {
  success: boolean;
  data?:
    | number
    | {user: IUser; expiredAt: string}
    | IBalance[]
    | IOrder[]
    | ICandlestickData[]
    | ICandlestick
    | ITickerData[]
    | ICryptocurrency[]
    | IAcceptedOrder
    | IAcceptedOrder[]
    | {
        txhash: string;
        orderSnapshot: IOrder;
        balanceSnapshot: IBalance[];
      }
    | IDepositOrder
    | {
        nextAvailableTime: number; // Info: next available time in seconds (20230531 - tzuhhan)
      }
    | {order: IOrder}
    | IQuotation
    | ITickerHistoryData[]
    | ITickerStatic
    | ITickerLiveStatistics
    | ITrade[]
    | IInstCandlestick
    | ITideBitPromotion
    | IWebsiteReserve
    | IUserAssets
    | IPersonalAchievement
    | IBadge
    | IRanking[]
    | ILeaderboard
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
