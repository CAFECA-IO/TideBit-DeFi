import {Badges} from '../../constants/badges';

export interface IBadge {
  badgeId: string;
  badgeName: string;
  userId: string;
  receiveTime: number; //0: not achieve yet
}

export const defaultBadges: IBadge[] = [
  {badgeName: Badges.DAILY_TOP_20, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.WEEKLY_TOP_20, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.MONTHLY_TOP_20, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.SHARING, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.LINKED, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.DEPOSIT, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.BACHELOR, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.MASTER, receiveTime: 0, badgeId: '', userId: ''},
  {badgeName: Badges.DOCTOR, receiveTime: 0, badgeId: '', userId: ''},
];

export const getDummyBadges = (userId: string): IBadge[] => {
  const randomTime = Math.floor(Math.random() * (1672531200 - 1684289192) + 1684289192);

  return defaultBadges.map(badge => {
    const randomBadge =
      Math.random() > 0.5
        ? {badgeName: badge.badgeName, badgeId: badge.badgeName}
        : {badgeName: '', badgeId: ''};
    const randomReceivedTime =
      randomTime + (randomTime % 2 === 0 ? Math.random() * 1000000 : -Math.random() * 1000000);

    return {
      ...randomBadge,
      receiveTime: randomReceivedTime,
      userId: userId,
    };
  });
};
