export type ITrend = 'UP' | 'DOWN' | 'EQUAL';
export interface ITrendConstant {
  [key: string]: ITrend;
}
export const Trend: ITrendConstant = {
  UP: 'UP',
  DOWN: 'DOWN',
  EQUAL: 'EQUAL',
};
