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
  | '1d';

export type ITimeSpanUnionConstant = {
  _1s: ITimeSpanUnion;
  _15s: ITimeSpanUnion;
  _30s: ITimeSpanUnion;
  _1m: ITimeSpanUnion;
  _3m: ITimeSpanUnion;
  _5m: ITimeSpanUnion;
  _15m: ITimeSpanUnion;
  _1h: ITimeSpanUnion;
  _4h: ITimeSpanUnion;
  _12h: ITimeSpanUnion;
  _1d: ITimeSpanUnion;
};

export const TimeSpanUnion: ITimeSpanUnionConstant = {
  _1s: '1s',
  _15s: '15s',
  _30s: '30s',
  _1m: '1m',
  _3m: '3m',
  _5m: '5m',
  _15m: '15m',
  _1h: '1h',
  _4h: '4h',
  _12h: '12h',
  _1d: '1d',
};
