export type ITimeSpanUnion = '1s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export type ISelectedTimeSpanUnion = '1s' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d';

export type ITimeSpanUnionConstant = {
  _1s: ITimeSpanUnion;
  _5m: ITimeSpanUnion;
  _15m: ITimeSpanUnion;
  _30m: ITimeSpanUnion;
  _1h: ITimeSpanUnion;
  _4h: ITimeSpanUnion;
  _12h: ITimeSpanUnion;
  _1d: ITimeSpanUnion;
};

export const TimeSpanUnion: ITimeSpanUnionConstant = {
  _1s: '1s',
  _5m: '5m',
  _15m: '15m',
  _30m: '30m',
  _1h: '1h',
  _4h: '4h',
  _12h: '12h',
  _1d: '1d',
};

export const getTime = (timeSpan: ITimeSpanUnion) => {
  let time = 1000;
  switch (timeSpan) {
    case TimeSpanUnion._1s:
      time = 1 * 1000;
      break;
    case TimeSpanUnion._5m:
      time = 5 * 60 * 1000;
      break;
    case TimeSpanUnion._15m:
      time = 15 * 60 * 1000;
      break;
    case TimeSpanUnion._30m:
      time = 30 * 60 * 1000;
      break;
    case TimeSpanUnion._1h:
      time = 60 * 60 * 1000;
      break;
    case TimeSpanUnion._4h:
      time = 4 * 60 * 60 * 1000;
      break;
    case TimeSpanUnion._12h:
      time = 12 * 60 * 60 * 1000;
      break;
    case TimeSpanUnion._1d:
      time = 24 * 60 * 60 * 1000;
      break;
    default:
      break;
  }
  return time;
};
