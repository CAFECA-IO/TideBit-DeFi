export type ITrend = 'UP' | 'DOWN' | 'EQUAL';
export interface ITrendConstant {
  UP: ITrend;
  DOWN: ITrend;
  EQUAL: ITrend;
}
export const Trend: ITrendConstant = {
  UP: 'UP',
  DOWN: 'DOWN',
  EQUAL: 'EQUAL',
};
