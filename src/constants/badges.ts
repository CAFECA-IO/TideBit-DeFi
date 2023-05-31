export type IBadges =
  | 'Daily_Top_20'
  | 'Weekly_Top_20'
  | 'Monthly_Top_20'
  | 'Sharing'
  | 'Linked'
  | 'Deposit'
  | 'Bachelor'
  | 'Master'
  | 'Doctor';

export type IBadgesConstant = {
  DAILY_TOP_20: IBadges;
  WEEKLY_TOP_20: IBadges;
  MONTHLY_TOP_20: IBadges;
  SHARING: IBadges;
  LINKED: IBadges;
  DEPOSIT: IBadges;
  BACHELOR: IBadges;
  MASTER: IBadges;
  DOCTOR: IBadges;
};

export const Badges: IBadgesConstant = {
  DAILY_TOP_20: 'Daily_Top_20',
  WEEKLY_TOP_20: 'Weekly_Top_20',
  MONTHLY_TOP_20: 'Monthly_Top_20',
  SHARING: 'Sharing',
  LINKED: 'Linked',
  DEPOSIT: 'Deposit',
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  DOCTOR: 'Doctor',
};
