export type ITimeSpanUnion =
  | '1s'
  | '15s'
  | '30s'
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '12h'
  | '1d'
  | '2m'
  | '10s'
  | '8m'
  | '24m'
  | '48m';

export type ITimeSpanUnionConstant = {
  _1s: ITimeSpanUnion;
  _10s: ITimeSpanUnion;
  _15s: ITimeSpanUnion;
  _30s: ITimeSpanUnion;
  _1m: ITimeSpanUnion;
  _2m: ITimeSpanUnion;
  _3m: ITimeSpanUnion;
  _5m: ITimeSpanUnion;
  _8m: ITimeSpanUnion;
  _15m: ITimeSpanUnion;
  _24m: ITimeSpanUnion;
  _30m: ITimeSpanUnion;
  _48m: ITimeSpanUnion;
  _1h: ITimeSpanUnion;
  _4h: ITimeSpanUnion;
  _12h: ITimeSpanUnion;
  _1d: ITimeSpanUnion;
};

export const TimeSpanUnion: ITimeSpanUnionConstant = {
  _1s: '1s',
  _10s: '10s',
  _15s: '15s',
  _30s: '30s',
  _1m: '1m',
  _2m: '2m',
  _3m: '3m',
  _5m: '5m',
  _8m: '8m',
  _15m: '15m',
  _24m: '24m',
  _30m: '30m',
  _48m: '48m',
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
    case TimeSpanUnion._10s:
      time = 10 * 1000;
      break;
    case TimeSpanUnion._15s:
      time = 15 * 1000;
      break;
    case TimeSpanUnion._30s:
      time = 30 * 1000;
      break;
    case TimeSpanUnion._1m:
      time = 1 * 60 * 1000;
      break;
    case TimeSpanUnion._2m:
      time = 2 * 60 * 1000;
      break;
    case TimeSpanUnion._3m:
      time = 3 * 60 * 1000;
      break;
    case TimeSpanUnion._5m:
      time = 5 * 60 * 1000;
      break;
    case TimeSpanUnion._8m:
      time = 8 * 60 * 1000;
      break;
    case TimeSpanUnion._15m:
      time = 15 * 60 * 1000;
      break;
    case TimeSpanUnion._24m:
      time = 24 * 60 * 1000;
      break;
    case TimeSpanUnion._30m:
      time = 30 * 60 * 1000;
      break;
    case TimeSpanUnion._48m:
      time = 48 * 60 * 1000;
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
