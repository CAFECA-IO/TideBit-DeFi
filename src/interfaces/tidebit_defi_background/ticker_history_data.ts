import {getTime} from './candlestickData';
import {ITimeSpanUnion} from './time_span_union';

export interface ITickerHistoryData {
  date: Date;
  open: number;
}

export const getDummyTickerHistoryData = (
  ticker: string,
  timeSpan: ITimeSpanUnion,
  limit: number
) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % getTime(timeSpan));
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
      date: new Date(nowSecond - (limit - i) * getTime(timeSpan)),
      open: open,
    };
    return result;
  });

  return data;
};
