import {IPnL} from './pnl';
import {ProfitState} from '../../constants/profit_state';
import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';

export interface IPersonalRanking {
  rank: number; //第幾名
  pnl: IPnL;
  cumulativePnl: IPnL;
}

export const defaultPersonalRanking: IPersonalRanking = {
  rank: -1,
  pnl: {type: ProfitState.EQUAL, value: 0},
  cumulativePnl: {type: ProfitState.EQUAL, value: 0},
};

export const getDummyPersonalRanking = (timeSpan: IRankingTimeSpan) => {
  let myRanking = defaultPersonalRanking;

  const randomRank = Math.abs(Math.floor(Math.random() * 100)) + 3;

  const randomPnlType = Math.random() >= 0.5 ? ProfitState.PROFIT : ProfitState.LOSS;
  const randomPnl = parseFloat((Math.random() * 100).toFixed(2));
  const randomCumulativePnl = parseFloat((Math.random() * 1000).toFixed(2));

  switch (timeSpan) {
    case RankingInterval.LIVE:
      myRanking = {
        rank: randomRank,
        pnl: {type: randomPnlType, value: randomPnl},
        cumulativePnl: {type: randomPnlType, value: randomCumulativePnl},
      };
      break;
    case RankingInterval.DAILY:
      myRanking = {
        rank: randomRank + (randomRank % 2 === 0 ? 1 : -1),
        pnl: {type: randomPnlType, value: randomPnl},
        cumulativePnl: {type: randomPnlType, value: randomCumulativePnl},
      };
      break;
    case RankingInterval.WEEKLY:
      myRanking = {
        rank: randomRank + (randomRank % 2 === 0 ? 9 : -5),
        pnl: {type: randomPnlType, value: randomPnl},
        cumulativePnl: {type: randomPnlType, value: randomCumulativePnl},
      };
      break;
    case RankingInterval.MONTHLY:
      myRanking = {
        rank: randomRank + (randomRank % 2 === 0 ? 20 : -10),
        pnl: {type: randomPnlType, value: randomPnl},
        cumulativePnl: {type: randomPnlType, value: randomCumulativePnl},
      };
      break;
  }

  return myRanking;
};
