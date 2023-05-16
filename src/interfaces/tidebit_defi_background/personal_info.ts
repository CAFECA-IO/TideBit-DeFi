export interface IPersonalInfo {
  userAvatar?: string;
  tradingVolume: number;
  onlineTime: number;
  diversification: number;
  hightestROI: number;
  lowestROI: number;
  badge: {
    Daily_20: boolean;
    Weekly_20: boolean;
    Monthly_20: boolean;
    Sharing: boolean;
    Linked: boolean;
    Deposit: boolean;
    Bachelor: boolean;
    Master: boolean;
    Doctor: boolean;
  };
}

export const defaultPersonalInfo: IPersonalInfo = {
  userAvatar: '/leaderboard/default_avatar.svg',
  tradingVolume: 0,
  onlineTime: 0,
  diversification: 0,
  hightestROI: 0,
  lowestROI: 0,
  badge: {
    Daily_20: false,
    Weekly_20: false,
    Monthly_20: false,
    Sharing: false,
    Linked: false,
    Deposit: false,
    Bachelor: false,
    Master: false,
    Doctor: false,
  },
};

export const dummyPersonalInfo: IPersonalInfo = {
  userAvatar: '/leaderboard/dummy_avatar_4.svg',
  tradingVolume: 23242,
  onlineTime: 238424214,
  diversification: 53.4,
  hightestROI: 24.67,
  lowestROI: -14.22,
  badge: {
    Daily_20: true,
    Weekly_20: false,
    Monthly_20: false,
    Sharing: true,
    Linked: true,
    Deposit: false,
    Bachelor: true,
    Master: false,
    Doctor: false,
  },
};
