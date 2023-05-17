import {IBadge} from './badge';
import {Badges} from '../../constants/badges';
import {DEFAULT_BEDGES} from '../../constants/display';
import {randomFloatFromInterval} from '../../lib/common';

export interface IPersonalAchievement {
  userAvatar?: string;
  tradingVolume: number;
  onlineTime: number;
  diversification: number;
  hightestROI: number;
  lowestROI: number;
  badges: IBadge[];
}

export const defaultPersonalAchievement: IPersonalAchievement = {
  userAvatar: '/leaderboard/default_avatar.svg',
  tradingVolume: 0,
  onlineTime: 0,
  diversification: 0,
  hightestROI: 0,
  lowestROI: 0,
  badges: DEFAULT_BEDGES,
};

export const dummyPersonalAchievement: IPersonalAchievement = {
  userAvatar: '/leaderboard/dummy_avatar_4.svg',
  tradingVolume: 23242,
  onlineTime: 238424214,
  diversification: 53.4,
  hightestROI: 24.67,
  lowestROI: -14.22,
  badges: [
    {name: Badges.DAILY_TOP_20, receiveTime: 1684289192},
    {name: Badges.WEEKLY_TOP_20, receiveTime: 0},
    {name: Badges.MONTHLY_TOP_20, receiveTime: 0},
    {name: Badges.SHARING, receiveTime: 1684229192},
    {name: Badges.LINKED, receiveTime: 1684289624},
    {name: Badges.DEPOSIT, receiveTime: 1684289192},
    {name: Badges.BACHELOR, receiveTime: 1683388800},
    {name: Badges.MASTER, receiveTime: 0},
    {name: Badges.DOCTOR, receiveTime: 0},
  ],
};

export const getDummyPersonalAchievements = (userId: string): IPersonalAchievement => {
  const randomUserAvatar =
    Math.random() > 0.5 ? `/leaderboard/dummy_avatar_1.png` : `/leaderboard/dummy_avatar_2.svg`;
  const randomTradingVolume = Math.floor(Math.random() * 100000);
  const randomFloat = randomFloatFromInterval(10, 90, 2);
  const randomTime = Math.floor(Math.random() * (1672531200 - 1684289192) + 1684289192);

  const randomBadges = DEFAULT_BEDGES.map(badge => {
    const randomBadge = Math.random() > 0.5 ? {name: badge.name} : {name: ''};

    return {
      ...randomBadge,
      receiveTime:
        randomTime + (randomTime % 2 === 0 ? Math.random() * 10000 : -Math.random() * 10000),
    };
  });

  const personalAchievements = {
    userAvatar: randomUserAvatar,
    tradingVolume: randomTradingVolume,
    onlineTime: randomTime,
    diversification: randomFloat + (randomFloat % 2 === 0 ? 7.7 : -6.08),
    hightestROI: randomFloat + (randomFloat % 2 === 0 ? 3.24 : -2.56),
    lowestROI: (randomFloat + (randomFloat % 2 === 0 ? -5.75 : 4.52)) * -1,
    badges: randomBadges,
  };

  return personalAchievements;
};
