/** Info: (20230329 - Shirley)
 * Draw a live candlestick chart with Tradingview Lightweight Charts Library
 * 1. Initial job (Specify the data spec)
 * 1.1 setup chart container and chart options with window size
 * 1.2 fetch candlestick chart data from market context
 * 1.3 data cleaning (Filter the data with the data spec)
 * 1.4 draw candlestick chart with data
 * 2. Periodically job
 * 2.1 renew chart with candlestick chart data in marketcontext is updated
 * 2.2 data cleaning
 * 2.3 draw candlestick chart with data
 */

import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  createChart,
  CrosshairMode,
  ColorType,
  ChartOptions,
  CandlestickData,
  WhitespaceData,
  UTCTimestamp,
  LocalizationOptions,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import Lottie, {useLottie} from 'lottie-react';
import spotAnimation from '../../../public/animation/circle.json';
import {
  EXAMPLE_BLUE_COLOR,
  LIGHT_GRAY_COLOR,
  LINE_GRAPH_STROKE_COLOR,
  TRADING_CHART_BORDER_COLOR,
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from 'react-icons/bs';
import {MarketContext, MarketProvider} from '../../contexts/market_context';
import {
  getNowSeconds,
  getTimestamp,
  randomFloatFromInterval,
  randomIntFromInterval,
  timestampToString,
} from '../../lib/common';
import {
  ICandlestickData,
  getDummyCandlestickChartData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
import {AppContext} from '../../contexts/app_context';
import Image from 'next/image';
import {GlobalContext} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {
  MAX_PRICE_TRADING_CHART_ONE_SEC,
  MIN_PRICE_TRADING_CHART_ONE_SEC,
  TRADING_CHART_PRICE_LIMIT_ONE_SEC,
  POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
} from '../../constants/config';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {TimeSpanUnion} from '../../interfaces/tidebit_defi_background/time_span_union';
import {freemem} from 'os';
import {normalize} from 'path';

interface ITradingChartGraphProps {
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  showPositionLabel: boolean;
  candlestickChartWidth: string;
  candlestickChartHeight: string;
}

interface VictoryThemeDefinition {
  axis: {
    style: {
      tickLabels: {
        fill: string;
        fontSize: number;
        fontFamily: string;
        padding: number;
      };
      axis: {
        stroke: string;
      };
      grid: {
        stroke: string;
      };
    };
  };
  line: {
    style: {
      data: {
        stroke: string;
        strokeWidth: number;
      };
    };
  };
}

export interface ILineChartData {
  x: Date;
  y: number | null;
}

export interface IHorizontalLineData {
  x: Date;
  y: number;
}

export interface IProcessCandlestickData {
  data: ICandlestickData[];
  requiredDataNum: number;
}

export interface ITrimDataProps {
  // data: ICandlestickData[];
  data: any[];
  requiredDataNum: number;
}

export const updateDummyCandlestickChartData = (data: ICandlestickData[]): ICandlestickData[] => {
  const n = 80;
  const chartBlank = 1.68;
  const dummyDataSize = 80;
  const unitOfLive = 1000;

  const now = new Date().getTime();

  const origin = [...data].slice(1);

  const count = countNullArrays(origin);

  /* Till: (20230329 - Shirley)
   const originWithoutNull = originalData.slice(0, -count);
   */
  const originWithoutNull = origin.filter(obj => !Object.values(obj.y).includes(null));

  const lastTime = originWithoutNull[originWithoutNull.length - 1]?.x.getTime() as number;
  const lastPoint = originWithoutNull[originWithoutNull.length - 1]?.y.close as number;

  const nowSecond = now - (now % unitOfLive);

  const newYs: (number | null)[] = new Array(4).fill(0).map(v => {
    const price = lastPoint * randomFloatFromInterval(0.95, 1.05, 2);

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const newCandlestickData: ICandlestickData = {
    x: new Date(nowSecond - 1 * unitOfLive),
    y: {
      open: newYs[0],
      high: newYs[1],
      low: newYs[2],
      close: newYs[3],
    },
  };

  const addition = n / chartBlank;

  const nullNum = 1;
  const nullTime = 10;

  const withNullData = [
    ...originWithoutNull,
    newCandlestickData,
    // ...Array.from({length: nullNum}, (_, i) => ({
    //   x: new Date(nowSecond + unitOfLive * nullTime),
    //   y: {
    //     open: null,
    //     high: null,
    //     low: null,
    //     close: null,
    //   },
    // })),
  ];

  return withNullData;
};

function countNullArrays(arr: ICandlestickData[]): number {
  const count = arr.reduce((acc, cur) => {
    if (Object.values(cur.y).every(v => v === null)) {
      acc++;
    }
    return acc;
  }, 0);
  return count;
}

// TODO: (20230313 - Shirley) after getting the complete data from Context, process it to the required format
export function processCandlestickData({data, requiredDataNum}: IProcessCandlestickData) {
  const origin = [...data].map(d => ({
    x: d.x,
    y: {
      open: d.y.open,
      high: d.y.high,
      low: d.y.low,
      close: d.y.close,
    },
  }));
  // const nullNum = countNullArrays(origin);
  const nullNum = 1;
  const nullTime = 10;

  const unitOfLive = 1000;
  const now = new Date().getTime();
  const nowSecond = now - (now % unitOfLive);

  const originWithoutNull = origin.filter(obj => !Object.values(obj.y).includes(null));
  const latestData = originWithoutNull.slice(-requiredDataNum);
  const toCandlestickData = [
    ...latestData,
    ...Array.from({length: nullNum}, (_, i) => ({
      x: new Date(nowSecond + unitOfLive * nullTime),
      y: [null, null, null, null],
    })),
  ];

  return toCandlestickData;
}

export interface ITrimCandlestickData {
  data: ICandlestickData[];
  dataSize: number;
  timespan: number;
}

export interface ITradingData {
  time: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}

export function parseCandlestickData({data, dataSize, timespan}: ITrimCandlestickData) {
  const createBaseArray = () => {
    const getLastTime = () => {
      const now = new Date().getTime();
      return now - (now % (timespan * 1000));
    };

    // Till: (20230410 - Shirley)
    // const getLastTime = () => {
    //   return data[data.length - 1]?.x.getTime() as number;
    // };

    const base = new Array(dataSize).fill(0).map((v, i) => {
      const eachTime = new Date(getLastTime() - (dataSize - i) * timespan * 1000);
      const eachTimestamp = eachTime.getTime() / 1000;

      return {
        x: eachTime,
        y: {
          open: null,
          high: null,
          low: null,
          close: null,
        },
      };
    });

    return base;
  };

  const filterCandlestickData = (data: ICandlestickData[], baseArray: ICandlestickData[]) => {
    let previousClose = 0;

    for (let i = 0; i < baseArray.length; i++) {
      const index = data.findIndex(d => {
        const baseTime = baseArray[i]?.x.getTime();
        const dataTime = d.x.getTime();
        return baseTime === dataTime;
      });
      if (index >= 0) {
        baseArray[i].y.open = data[index].y.open;
        baseArray[i].y.high = data[index].y.high;
        baseArray[i].y.low = data[index].y.low;
        baseArray[i].y.close = data[index].y.close;

        previousClose = data[index].y.close || previousClose;
      } else if (previousClose !== null) {
        baseArray[i].y.open = previousClose;
        baseArray[i].y.high = previousClose;
        baseArray[i].y.low = previousClose;
        baseArray[i].y.close = previousClose;
      }
    }

    const result = [...baseArray];

    return result;
  };

  const processCandlestickData = (candles: ICandlestickData[]) => {
    const nullTime = 10;

    const baseArray = createBaseArray();
    const filteredData = filterCandlestickData(candles, baseArray);
    const latestData = filteredData.concat({
      x: new Date(filteredData[filteredData.length - 1].x.getTime() + timespan * nullTime * 1000),
      y: {
        open: null,
        high: null,
        low: null,
        close: null,
      },
    });

    return latestData;
  };

  const processedData = processCandlestickData(data.slice(-dataSize));
  return processedData;

  /* Till: (20230410 - Shirley)
  // const dataWithoutNull = data.filter(obj => !obj.y.includes(null));
  // const latestData = dataWithoutNull.slice(-dataSize);

  // if (latestData === undefined || latestData.length === 0) return;

  // const nullTime = 10;
  // const unitOfLive = 1000;

  // const trimmedData = latestData.concat({
  //   x: new Date(latestData[latestData.length - 1].x.getTime() + unitOfLive * nullTime),
  //   y: [null, null, null, null],
  // });

  // return trimmedData;
  */
}

export default function CandlestickChart({
  strokeColor,
  candlestickOn,
  lineGraphOn,
  showPositionLabel,
  candlestickChartWidth,
  candlestickChartHeight,
  ...otherProps
}: ITradingChartGraphProps) {
  const marketCtx = useContext(MarketContext);
  const appCtx = useContext(AppContext);
  const globalCtx = useContext(GlobalContext);
  const userCtx = useContext(UserContext);

  const candlestickChartDataFromCtx =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const NULL_ARRAY_NUM = 1;

  const trimmedData = parseCandlestickData({
    data: candlestickChartDataFromCtx,
    dataSize: 30,
    timespan: 1,
  });

  const lwcData = trimmedData.map((d: ICandlestickData) => {
    return {
      time: d.x.getTime() / 1000,
      open: d.y.open,
      high: d.y.high,
      low: d.y.low,
      close: d.y.close,
    };
  });

  // Deprecated: before merging into develop (20230323 - Shirley)
  // const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
  //   ICandlestickData[] | undefined
  // >(trimmedData);

  const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
    useStateRef<ICandlestickData[] | undefined>(trimmedData);

  const ys = trimmedData
    ? (trimmedData
        .filter((data: ICandlestickData) => Object.values(data.y).includes(null) === false)
        .map((data: ICandlestickData) => [data.y.open, data.y.high, data.y.low, data.y.close])
        .flat() as number[])
    : [];

  const max = ys.length > 0 ? Math.max(...ys) : null;
  const min = ys.length > 0 ? Math.min(...ys) : null;

  const maxNumber = max && min ? TRADING_CHART_PRICE_LIMIT_ONE_SEC * (max - min) + max : 10000;
  const minNumber = max && min ? min - TRADING_CHART_PRICE_LIMIT_ONE_SEC * (max - min) : 0;

  // Till: (20230412 - Shirley)
  // console.log('before isDisplayedCharts, marketCtx', candlestickChartDataFromCtx);
  // console.log('before isDisplayedCharts, latest price', toLatestPriceLineDataRef.current);
  // console.log('before isDisplayedCharts, candle', toCandlestickChartDataRef.current);
  // console.log('before isDisplayedCharts, line', toLineChartDataRef.current);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi;
  let candlestickSeries: ISeriesApi<'Candlestick'>;
  let initData: CandlestickData[];

  const createBaseArray = ({timespan, dataSize}: {timespan: number; dataSize: number}) => {
    const getLastTime = () => {
      const now = new Date().getTime();
      return now - (now % (timespan * 1000));
    };

    const base = new Array(dataSize).fill(0).map((v, i) => {
      const eachTime = new Date(getLastTime() - (dataSize - i) * timespan * 1000);
      const eachTimestamp = eachTime.getTime() / 1000;

      return {
        time: eachTimestamp as UTCTimestamp,
        open: null,
        high: null,
        low: null,
        close: null,
      };
    });

    const newBase = [...base];

    // Deprecated: before merging into develop (20230329 - Shirley)
    // eslint-disable-next-line no-console
    console.log('spec base array in createBaseArray', newBase);

    return base;
  };

  const filterCandlestickData = ({
    dataArray,
    baseArray,
  }: {
    dataArray: ITradingData[];
    baseArray: ITradingData[];
  }) => {
    let previousClose = 0;
    const base = [...baseArray];
    const data = [...dataArray];

    for (let i = 0; i < base.length; i++) {
      const index = data.findIndex(d => {
        const baseTime = base[i]?.time;
        const dataTime = d.time;
        return baseTime === dataTime;
      });
      if (index >= 0) {
        base[i].open = data[index].open;
        base[i].high = data[index].high;
        base[i].low = data[index].low;
        base[i].close = data[index].close;

        previousClose = data[index].close || previousClose;
      } else if (previousClose !== null) {
        base[i].open = previousClose;
        base[i].high = previousClose;
        base[i].low = previousClose;
        base[i].close = previousClose;
      }
    }

    const result = base;

    return result;
  };

  // Info: specify the data spec (20230330 - Shirley)
  const initJob = ({data, dataSize, timespan}: ITrimCandlestickData) => {
    const spec = createBaseArray({dataSize, timespan});

    // Deprecated: before merging into develop (20230329 - Shirley)
    // eslint-disable-next-line no-console
    console.log('spec in initJob', JSON.parse(JSON.stringify(spec)));
    // eslint-disable-next-line no-console
    console.log('data in initJob', data);
    // eslint-disable-next-line no-console
    console.log('market context data in initJob', marketCtx.candlestickChartData);

    // ToDo: Get data from context (20230330 - Shirley)
    const raw = getDummyCandlestickChartData(50, TimeSpanUnion._1s).map(d => ({
      time: (d.x.getTime() / 1000) as UTCTimestamp,
      open: d.y.open,
      high: d.y.high,
      low: d.y.low,
      close: d.y.close,
    }));

    const filtered = filterCandlestickData({dataArray: raw, baseArray: spec});

    // Deprecated: before merging into develop (20230329 - Shirley)
    // eslint-disable-next-line no-console
    console.log('raw dummy data in initJob', raw);
    // eslint-disable-next-line no-console
    console.log('filtered data in initJob', filtered);

    return filtered as CandlestickData[];
  };

  const locale: LocalizationOptions = {
    locale: 'zh-TW',
    dateFormat: 'yyyy-MM-dd',
  };

  const chartOptions = {
    width:
      globalCtx.layoutAssertion === 'desktop'
        ? globalCtx.width * 0.6 - 2000 / globalCtx.width + (globalCtx.width - 1150) * 0.5
        : globalCtx.width * 0.9,
    height: 300,
    layout: {
      fontSize: 12,
      fontFamily: 'barlow, sans-serif',
      background: {type: ColorType.Solid, color: LINE_GRAPH_STROKE_COLOR.BLACK},
      textColor: LINE_GRAPH_STROKE_COLOR.LIGHT_GRAY,
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        visible: false,
      },
    },

    handleScale: {
      pinch: true,
      mouseWheel: true,
      axisDoubleClickReset: true,
      axisPressedMouseMove: false,
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: LINE_GRAPH_STROKE_COLOR.DEFAULT,
      },
      horzLine: {
        color: LINE_GRAPH_STROKE_COLOR.DEFAULT,
      },
    },

    timeScale: {
      timeVisible: true,
      secondsVisible: true,
      ticksVisible: false,
      fixLeftEdge: true,
      shiftVisibleRangeOnNewBar: true,
      borderVisible: false,
      // Till: Restrict the drag (20230413 - Shirley) // fixRightEdge: true,
    },
    localization: locale,
  };

  // Info: 1. initialize the chart options and data (20230330 - Shirley)
  const initChart = () => {
    initData = initJob({
      data: marketCtx?.candlestickChartData ?? [],
      dataSize: 30,
      timespan: 1,
    });

    if (chartContainerRef.current) {
      // Info: Draw
      chart = createChart(chartContainerRef.current, chartOptions);

      // chart.timeScale().applyOptions({
      //   borderVisible: false,
      // });

      candlestickSeries = chart.addCandlestickSeries({
        upColor: LINE_GRAPH_STROKE_COLOR.UP,
        downColor: LINE_GRAPH_STROKE_COLOR.DOWN,
        borderVisible: false,
        wickUpColor: LINE_GRAPH_STROKE_COLOR.UP,
        wickDownColor: LINE_GRAPH_STROKE_COLOR.DOWN,
      });

      candlestickSeries.setData(initData);

      chart.timeScale().fitContent();
    }
  };

  // Info: 2. Renew the chart with the filtered and merged data (20230330 - Shirley)
  /**
   * Trade array (交易的資料): generateRandomTrade return `{price:number, volume:number, timestamp: UTCTimestamp}`
   * Candlestick array: translate TradeArray to `{x: Date, y: {open: number, high: number, low: number, close: number}}`
   */

  const generateRandomTrade = () => {
    const trade = {
      price: Math.random() * 100,
      volume: Math.random() * 100,
      time: (Date.now() / 1000) as UTCTimestamp,
    };

    return trade;
  };

  const newArr = new Array(10).fill(0).map(d => generateRandomTrade());

  /**
   * Transform newArr to CandlestickData[] (Round up the timestamp to the nearest second)
   */
  // const transform = (
  //   arr: {
  //     price: number;
  //     volume: number;
  //     time: UTCTimestamp;
  //   }[]
  // ) => {
  //   const candlestickData = arr.reduce((acc, curr) => {
  //     const {price, volume, time} = curr;
  //     const timestamp = Math.ceil(time);
  //     const last = acc[acc.length - 1];

  //     if (last && last.time === timestamp) {
  //       const {open, high, low, close} = last;
  //       const newHigh = Math.max(high, price);
  //       const newLow = Math.min(low, price);
  //       const newClose = price;

  //       return [
  //         ...acc.slice(0, acc.length - 1),
  //         {
  //           time: timestamp,
  //           open,
  //           high: newHigh,
  //           low: newLow,
  //           close: newClose,
  //         },
  //       ];
  //     } else {
  //       return [
  //         ...acc,
  //         {
  //           time: timestamp,
  //           open: price,
  //           high: price,
  //           low: price,
  //           close: price,
  //         },
  //       ];
  //     }
  //   }, [] as CandlestickData[]);
  //   return candlestickData;
  // };

  const updateChart = () => {
    const generateRandomCandle = () => {
      const candles: ICandlestickData[] = initData.map(d => ({
        x: new Date((d.time as number) * 1000),
        y: {
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        },
      }));
      const newCandles = updateDummyCandlestickChartData(candles);

      return newCandles;
    };

    const updateData = () => {
      const randomCandle = generateRandomCandle().map(d => ({
        time: (d.x.getTime() / 1000) as UTCTimestamp,
        open: d.y.open,
        high: d.y.high,
        low: d.y.low,
        close: d.y.close,
      })) as CandlestickData[];

      candlestickSeries.update(randomCandle[randomCandle.length - 1]);

      // // TODO: Get the lastest price position and locate a lottie (20230329 - Shirley)
      // const lastPrice = randomCandle[randomCandle.length - 1].close;
      // console.log('object', randomCandle[randomCandle.length - 1]);
      // console.log('close coordinate', candlestickSeries.priceToCoordinate(lastPrice));
    };

    updateData();
  };

  const handleResize = () => {
    chart.applyOptions({width: Number(chartContainerRef?.current?.clientWidth) - 50});
  };

  /**
   * ToDo:
   * 高頻率更新的資料，需要更注意流程
   * 1. 圖表樣式 不應該在 useEffect 被重複執行
   * 2. data cleaning
   * 3. 畫圖 (函式把圖畫出來)
   */
  // useEffect(() => {
  //   initChart();

  //   return () => {
  //     chart.remove();
  //   };
  // }, [globalCtx.width]);

  useEffect(() => {
    // Till: (20230412 - Shirley)
    // if (chartContainerRef.current) {

    // Info: 1. Initial job (20230330 - Shirley)
    initChart();

    // Info: 2. Periodical job (20230330 - Shirley)
    // ToDo: (20230330 - Shirley) updates (vs useEffect)
    const intervalId = setInterval(updateChart, 200);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      chart.remove();
    };
    // }
  }, []); // chartContainerRef

  /* ToDO: Get candlestick data from ctx (20230330 - Shirley) */
  useEffect(() => {
    const trimmedData = parseCandlestickData({
      data: marketCtx.candlestickChartData ?? [],
      dataSize: 30,
      timespan: 1,
    });

    const lwcData = trimmedData.map((d: ICandlestickData) => {
      return {
        time: d.x.getTime() / 1000,
        open: d.y.open,
        high: d.y.high,
        low: d.y.low,
        close: d.y.close,
      };
    });

    // Deprecated: before merging into develop (20230329 - Shirley)
    // eslint-disable-next-line no-console
    console.log('market data which comply with data spec', lwcData);
    // eslint-disable-next-line no-console
    console.log('whole data from ctx', marketCtx.candlestickChartData);
  }, [marketCtx.candlestickChartData]);

  /* ToDo: Resize the chart for RWD solely (20230330 - Shirley) */
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   if (mounted) return;
  //   setMounted(true);

  //   initChart();
  // }, [globalCtx.width]);

  return (
    <>
      {/* <div className="-ml-5 w-full lg:w-7/10">Candlestick Chart with D3.js</div> */}
      <div className="ml-5 pt-20 pb-20 lg:w-7/10 lg:pt-14 lg:pb-5">
        <div ref={chartContainerRef} className="hover:cursor-crosshair"></div>
      </div>
    </>
  );
}
