import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';

export interface IRanking {
  rank: number;
  userName: string;
  userAvatar?: string;
  cumulativePnl: number;
}

export interface ILeaderboard {
  startTime: number;
  endTime: number;
  rankings: IRanking[];
}

export const defaultRanking: IRanking = {
  rank: -1,
  userName: '-',
  cumulativePnl: 0,
};

export const defaultLeaderboard: ILeaderboard = {
  startTime: -1,
  endTime: -1,
  rankings: [defaultRanking, defaultRanking, defaultRanking],
};

export const dummyLiveLeaderboard: ILeaderboard = {
  startTime: 1683870086,
  endTime: 1683956486,
  rankings: [
    {
      rank: 1,
      userName: 'Rose',
      userAvatar: '/leaderboard/dummy_avatar_1.svg',
      cumulativePnl: 47.45,
    },
    {
      rank: 2,
      userName: 'Bruce',
      userAvatar: '/leaderboard/dummy_avatar_2.svg',
      cumulativePnl: 43.02,
    },
    {
      rank: 3,
      userName: 'Simon',
      userAvatar: '/leaderboard/dummy_avatar_3.svg',
      cumulativePnl: 34.6,
    },
    {rank: 4, userName: 'Lily', cumulativePnl: 21.04},
    {rank: 5, userName: 'Jack', cumulativePnl: 15.433},
    {rank: 6, userName: 'Will', cumulativePnl: 15.33},
    {rank: 7, userName: 'Tom', cumulativePnl: 11.52},
    {rank: 8, userName: 'Mary', cumulativePnl: 10.22},
    {rank: 9, userName: 'Aliza', cumulativePnl: 6.84},
    {rank: 10, userName: 'David', cumulativePnl: 5.9},
  ],
};

export const dummyDailyLeaderboard: ILeaderboard = {
  startTime: 1683648000,
  endTime: 1683734400,
  rankings: [
    {
      rank: 1,
      userName: 'Simon',
      userAvatar: '/leaderboard/dummy_avatar_3.svg',
      cumulativePnl: 143.2,
    },
    {
      rank: 2,
      userName: 'Bruce',
      userAvatar: '/leaderboard/dummy_avatar_2.svg',
      cumulativePnl: 134.64,
    },
    {
      rank: 3,
      userName: 'Jack',
      cumulativePnl: 125.45,
    },
    {
      rank: 4,
      userName: 'Rose',
      userAvatar: '/leaderboard/dummy_avatar_1.svg',
      cumulativePnl: 121.04,
    },
    {rank: 5, userName: 'Lily', cumulativePnl: 115.433},
    {rank: 6, userName: 'Will', cumulativePnl: 115.33},
    {rank: 7, userName: 'Tom', cumulativePnl: 111.52},
    {rank: 8, userName: 'Eric', cumulativePnl: 101.2},
    {rank: 9, userName: 'Aliza', cumulativePnl: 61.84},
    {rank: 10, userName: 'David', cumulativePnl: 57.9},
  ],
};

export const dummyWeeklyLeaderboard: ILeaderboard = {
  startTime: 1683302400,
  endTime: 1683820800,
  rankings: [
    {
      rank: 1,
      userName: 'Rose',
      userAvatar: '/leaderboard/dummy_avatar_1.svg',
      cumulativePnl: 444.111,
    },
    {
      rank: 2,
      userName: 'Bruce',
      userAvatar: '/leaderboard/dummy_avatar_2.svg',
      cumulativePnl: 363.66,
    },
    {
      rank: 3,
      userName: 'Simon',
      userAvatar: '/leaderboard/dummy_avatar_3.svg',
      cumulativePnl: 251.02,
    },
    {rank: 4, userName: 'Jack', cumulativePnl: 232.46},
    {rank: 5, userName: 'Lily', cumulativePnl: 222.222},
    {
      rank: 6,
      userName: 'Larry',
      userAvatar: '/leaderboard/dummy_avatar_4.svg',
      cumulativePnl: 17.33,
    },
    {rank: 7, userName: 'Jone', cumulativePnl: 215.33},
    {rank: 8, userName: 'Mary', cumulativePnl: 210.2},
    {rank: 9, userName: 'Aliza', cumulativePnl: 139.84},
    {rank: 10, userName: 'Will', cumulativePnl: 125.93},
  ],
};

export const dummyMonthlyLeaderboard: ILeaderboard = {
  startTime: 1681315200,
  endTime: 1683820800,
  rankings: [
    {
      rank: 1,
      userName: 'Simon',
      userAvatar: '/leaderboard/dummy_avatar_3.svg',
      cumulativePnl: 541.02,
    },
    {
      rank: 2,
      userName: 'Rose',
      userAvatar: '/leaderboard/dummy_avatar_1.svg',
      cumulativePnl: 423.58,
    },
    {
      rank: 3,
      userName: 'Bruce',
      userAvatar: '/leaderboard/dummy_avatar_2.svg',
      cumulativePnl: 414.111,
    },
    {rank: 4, userName: 'Jack', cumulativePnl: 374.46},
    {rank: 5, userName: 'Mary', cumulativePnl: 329.42},
    {rank: 6, userName: 'Larry', cumulativePnl: 317.23},
    {rank: 7, userName: 'Jone', cumulativePnl: 315.33},
    {rank: 8, userName: 'Mary', cumulativePnl: 310.2},
    {rank: 9, userName: 'Aliza', cumulativePnl: 299.84},
    {rank: 10, userName: 'Molly', cumulativePnl: 245.9},
  ],
};

export const getDummyLeaderboard = (timeSpan: IRankingTimeSpan) => {
  let result: ILeaderboard = defaultLeaderboard;
  switch (timeSpan) {
    case RankingInterval.LIVE:
      result = dummyLiveLeaderboard;
      break;
    case RankingInterval.DAILY:
      result = dummyDailyLeaderboard;
      break;
    case RankingInterval.WEEKLY:
      result = dummyWeeklyLeaderboard;
      break;
    case RankingInterval.MONTHLY:
      result = dummyMonthlyLeaderboard;
      break;
  }
  return result;
};
