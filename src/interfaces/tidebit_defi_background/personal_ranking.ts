import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';

export interface IPersonalRanking {
  rank: number; //第幾名
  pnl: number;
  cumulativePnl: number;
}

export const defaultPersonalRanking: IPersonalRanking = {
  rank: -1,
  pnl: 0,
  cumulativePnl: 0,
};

export const getDummyPersonalRanking = (timeSpan: IRankingTimeSpan) => {
  let myRanking = defaultPersonalRanking;
  switch (timeSpan) {
    case RankingInterval.LIVE:
      myRanking = {
        rank: 32,
        pnl: -7.034,
        cumulativePnl: 3.32,
      };
      break;
    case RankingInterval.DAILY:
      myRanking = {
        rank: 43,
        pnl: -5.3,
        cumulativePnl: 12.45,
      };
      break;
    case RankingInterval.WEEKLY:
      myRanking = {
        rank: 75,
        pnl: 3.41,
        cumulativePnl: 29,
      };
      break;
    case RankingInterval.MONTHLY:
      myRanking = {
        rank: 103,
        pnl: 7.95,
        cumulativePnl: 24.34,
      };
      break;
  }

  return myRanking;
};
