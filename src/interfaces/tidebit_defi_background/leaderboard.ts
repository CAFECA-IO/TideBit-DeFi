import {IPnL} from './pnl';
import {ProfitState} from '../../constants/profit_state';
import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';

export interface IRanking {
  rank: number;
  userName: string;
  userAvatar?: string;
  cumulativePnl: IPnL;
}

export interface ILeaderboard {
  startTime: number;
  endTime: number;
  rankings: IRanking[];
}

export const defaultRanking: IRanking = {
  rank: -1,
  userName: '-',
  cumulativePnl: {type: ProfitState.EQUAL, value: 0},
};

export const defaultLeaderboard: ILeaderboard = {
  startTime: -1,
  endTime: -1,
  rankings: [defaultRanking, defaultRanking, defaultRanking],
};

export const getDummyLeaderboard = (timeSpan: IRankingTimeSpan) => {
  let result: ILeaderboard = defaultLeaderboard;

  const nameData = [
    'Aliza',
    'Bruce',
    'Carol',
    'Diamond',
    'Eric',
    'Frank',
    'Grace',
    'Hensal',
    'Iris',
    'Jason',
    'Kevin',
    'Larry',
    'Mason',
    'Nancy',
    'Olivia',
    'Paul',
    'Rose',
    'Simon',
    'Vicky',
    'Will',
    'Xavier',
    'Yvonne',
    'Zoe',
  ];

  const now = Math.floor(Date.now() / 1000);

  const ranks = Array.from(Array(20).keys()).map(i => i + 1);

  /* Info:(20230515 - Julian) create random names array from the nameData, without repeating */
  const names = ranks.map(i => {
    const index = Math.floor(Math.random() * nameData.length);
    const name = nameData[index];
    nameData.splice(index, 1);
    return name;
  });

  const pnls = ranks.map(i => parseFloat((Math.random() * 1000).toFixed(2))).sort((a, b) => b - a);

  const rankings: IRanking[] = [
    ...ranks.map((rank, index) => {
      const userName = names[index] ?? 'Rao';
      const userAvatar =
        userName.slice(0, 1) === 'R'
          ? `/leaderboard/dummy_avatar_1.svg`
          : userName.slice(0, 1) === 'B'
          ? `/leaderboard/dummy_avatar_2.svg`
          : userName.slice(0, 1) === 'S'
          ? `/leaderboard/dummy_avatar_3.svg`
          : userName.slice(0, 1) === 'L'
          ? `/leaderboard/dummy_avatar_4.svg`
          : `/leaderboard/default_avatar.svg`;
      const cumulativePnl = {type: ProfitState.PROFIT, value: pnls[index]};
      return {rank, userName, userAvatar, cumulativePnl};
    }),
  ];

  switch (timeSpan) {
    case RankingInterval.LIVE:
      result = {
        startTime: now,
        endTime: now + 86400,
        rankings: rankings,
      };
      break;
    case RankingInterval.DAILY:
      result = {
        startTime: now - 86400,
        endTime: now,
        rankings: rankings,
      };
      break;
    case RankingInterval.WEEKLY:
      result = {
        startTime: now - 86400 * 7,
        endTime: now - 86400 * 6,
        rankings: rankings,
      };
      break;
    case RankingInterval.MONTHLY:
      result = {
        startTime: now - 86400 * 30,
        endTime: now - 86400 * 29,
        rankings: rankings,
      };
      break;
  }
  return result;
};
