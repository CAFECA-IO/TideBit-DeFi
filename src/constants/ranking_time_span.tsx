export type IRankingTimeSpan = 'LIVE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export interface IRankingTimeSpanConstant {
  LIVE: IRankingTimeSpan;
  DAILY: IRankingTimeSpan;
  WEEKLY: IRankingTimeSpan;
  MONTHLY: IRankingTimeSpan;
}
export const RankingInterval: IRankingTimeSpanConstant = {
  LIVE: 'LIVE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};
