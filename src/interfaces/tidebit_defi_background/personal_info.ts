import {IBadge} from './badge';
import {Badges} from '../../constants/badges';
import {DEFAULT_BEDGES} from '../../constants/display';

export interface IPersonalInfo {
  userAvatar?: string;
  tradingVolume: number;
  onlineTime: number;
  diversification: number;
  hightestROI: number;
  lowestROI: number;
  badges: IBadge[];
}

export const defaultPersonalInfo: IPersonalInfo = {
  userAvatar: '/leaderboard/default_avatar.svg',
  tradingVolume: 0,
  onlineTime: 0,
  diversification: 0,
  hightestROI: 0,
  lowestROI: 0,
  badges: DEFAULT_BEDGES,
};

export const dummyPersonalInfo: IPersonalInfo = {
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
