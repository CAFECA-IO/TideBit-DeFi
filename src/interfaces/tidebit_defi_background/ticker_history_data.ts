import {getTime} from './candlestickData';
import {ITimeSpanUnion, TimeSpanUnion} from './time_span_union';

const defaultLimit = 450;
const defaultTimeSpan = TimeSpanUnion._1m;

export interface ITickerHistoryData {
  date: Date;
  open: number;
}

export const getDummyTickerHistoryData = (
  tickerId: string,
  options: {
    timeSpan?: ITimeSpanUnion;
    begin?: number;
    end?: number;
    limit?: number;
  }
) => {
  const timeSpan = options.timeSpan ?? defaultTimeSpan;
  const limit = options.limit ?? defaultLimit;
  const begin = options.begin;
  const beginSecond = begin ? begin - (begin % getTime(defaultTimeSpan)) : undefined;
  const end = options.end ?? new Date().getTime();
  const endSecond = end - (end % getTime(timeSpan));
  let point = 1288.4;
  let lastPrice = 0;
  const data = new Array(limit).fill(0).map((v, i) => {
    const rnd = Math.random() / 1.2;
    const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
    const price = point * ts;
    const open = Math.trunc(price * 100) / 100;
    lastPrice = price;
    point = lastPrice;
    const result: ITickerHistoryData = {
      date: beginSecond
        ? new Date(beginSecond + i * getTime(timeSpan))
        : new Date(endSecond - (limit - i) * getTime(timeSpan)),
      open: open,
    };
    return result;
  });

  return data;
};
