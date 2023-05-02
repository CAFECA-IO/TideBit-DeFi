import {randomFloatFromInterval} from '../../lib/common';
import {getTime, ITimeSpanUnion} from '../../constants/time_span_union';

const chartBlank = 1.68;
const dummyDataSize = 80;
const unitOfLive = 1000;

export interface ICandle {
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}

export interface ISortedCandlestick {
  [second: number]: ICandlestickData;
}

export interface ITrade {
  tradeId: string;
  instId: string;
  baseUnit: string;
  quoteUnit: string;
  source: number; // Info: trade source (OKX, CoinBase, etc.) (20230419 - tzuhan)
  type: number; // Info: trade type (market, limit, ioc etc.) (20230419 - tzuhan)
  side: number; // Info: buy or sell (20230419 - tzuhan)
  price: number;
  amount: number;
  volume: number; // TODO: current would be 0, 之後需要寫爬蟲取得 (20230419 - tzuhan)
  timestamp: number;
}
export interface formattedTrades {
  second: number;
  trades: {
    open: ITrade;
    high: ITrade;
    low: ITrade;
    close: ITrade;
  };
  datas: ITrade[];
}

export interface ICandlestickData {
  x: Date;
  y: ICandle;
  trade?: formattedTrades; // Deprecated: when data is correct (20230425 - tzuhan)
}

export interface ICandlestick {
  instId: string;
  candlesticks: ICandlestickData[];
}

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
      y: {
        open: y[0],
        high: y[1],
        low: y[2],
        close: y[3],
      },
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

export const updateDummyCandlestickChartData = (
  data: ICandlestickData[],
  timeSpan: ITimeSpanUnion
) => {
  // Info: update dummy data with the certain amount of non-null data (20230407 - Shirley)
  const origin = [...data];
  const originWithoutNull = origin.filter(obj => !Object.values(obj.y).includes(null));
  const stripped = originWithoutNull.slice(1);

  const lastData = stripped[stripped.length - 1];
  const lastSecond = lastData.x.getTime();
  const point = lastData?.y.close as number;

  const now = new Date().getTime();
  const nowSecond = now - (now % getTime(timeSpan));

  const y: [...number[]] = new Array(4).fill(0).map(v => {
    const ts = randomFloatFromInterval(0.95, 1.05, 2);
    const price = point * ts;

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const result: ICandlestickData = {
    // x: new Date(nowSecond - 1 * getTime(timeSpan)),
    x: new Date(lastSecond + getTime(timeSpan)),
    y: {
      open: y[0],
      high: y[1],
      low: y[2],
      close: y[3],
    },
  };

  const newData = [...data, result];

  return newData;
};
