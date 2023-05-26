import {IBadge, getDummyBadges, defaultBadges} from './badge';
import {randomFloatFromInterval} from '../../lib/common';

export interface IPersonalAchievement {
  userId: string;
  userName: string;
  userAvatar?: string;
  tradingVolume: number;
  onlineTime: number;
  diversification: number;
  hightestROI: number;
  lowestROI: number;
  badges: IBadge[];
}

export const defaultPersonalAchievement: IPersonalAchievement = {
  userId: 'N/A',
  userName: 'N/A',
  userAvatar: '/leaderboard/default_avatar.svg',
  tradingVolume: 0,
  onlineTime: 0,
  diversification: 0,
  hightestROI: 0,
  lowestROI: 0,
  badges: defaultBadges,
};

export const getDummyPersonalAchievements = (userId: string): IPersonalAchievement => {
  const randomUserAvatar = '/leaderboard/default_avatar.svg';
  const randomTradingVolume = Math.floor(Math.random() * 100000);
  const randomOnlineTime = Math.floor(Math.random() * 1000000);
  const randomFloat = randomFloatFromInterval(10, 90, 2);
  const randomBadges = getDummyBadges(userId);

  const personalAchievements = {
    userId: userId,
    userName: userId,
    userAvatar: randomUserAvatar,
    tradingVolume: randomTradingVolume,
    onlineTime: randomOnlineTime,
    diversification: randomFloat + (randomFloat % 2 === 0 ? 7.7 : -6.08),
    hightestROI: randomFloat + (randomFloat % 2 === 0 ? 3.24 : -2.56),
    lowestROI: (randomFloat + (randomFloat % 2 === 0 ? -5.75 : 4.52)) * -1,
    badges: randomBadges,
  };

  return personalAchievements;
};
