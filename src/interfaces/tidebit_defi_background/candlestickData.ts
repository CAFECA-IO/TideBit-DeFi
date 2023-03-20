import {ITimeSpanUnion, TimeSpanUnion} from './time_span_union';

const chartBlank = 1.68;
const dummyDataSize = 80;
const unitOfLive = 1000;

export interface ICandlestickData {
  x: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const getTime = (timeSpan: ITimeSpanUnion) => {
  let time = 1000;
  switch (timeSpan) {
    case TimeSpanUnion._1s:
      time = 1 * 1000;
      break;
    case TimeSpanUnion._1m:
      time = 1 * 60 * 1000;
      break;
    case TimeSpanUnion._3m:
      time = 3 * 60 * 1000;
      break;
    case TimeSpanUnion._5m:
      time = 5 * 60 * 1000;
      break;
    case TimeSpanUnion._15m:
      time = 15 * 60 * 1000;
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

/* Till: remove generate dummy price data (20230327 - Tzuhan)
export const getDummyPrices = (point: number) => {
  const prices: [...(number | null)[]] = new Array(4).fill(0).map(v => {
    const rnd = Math.random() / 1.2;
    const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
    const price = point * ts;
    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });
  return prices;
};
*/

export const getDummyCandlestickChartData = (
  dataSize = dummyDataSize,
  timeSpan: ITimeSpanUnion
) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % getTime(timeSpan));
  let point = 1288.4;
  let lastPrice = 0;
  const data = new Array(dataSize).fill(0).map((v, i) => {
    const y: [...number[]] = new Array(4).fill(0).map(v => {
      const rnd = Math.random() / 1.2;
      const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
      const price = point * ts;

      const prettyPrice = Math.trunc(price * 100) / 100;
      lastPrice = price;
      return prettyPrice;
    });
    point = lastPrice;

    const result: ICandlestickData = {
      x: new Date(nowSecond - (dataSize - i) * getTime(timeSpan)),
      open: y[0],
      high: y[1],
      low: y[2],
      close: y[3],
    };
    return result;
  });
  // const addition = dataSize / chartBlank;

  // null data
  // data.push({
  //   x: new Date(nowSecond + addition * getTime(timeSpan)),
  //   y: [null, null, null, null],
  // });

  return data;
};
