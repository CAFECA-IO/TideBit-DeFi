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
  time: UTCTimestamp;
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

  const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
    useStateRef<ICandlestickData[] | undefined>(trimmedData);

  // Till: (20230412 - Shirley)
  // console.log('before isDisplayedCharts, marketCtx', candlestickChartDataFromCtx);
  // console.log('before isDisplayedCharts, latest price', toLatestPriceLineDataRef.current);
  // console.log('before isDisplayedCharts, candle', toCandlestickChartDataRef.current);
  // console.log('before isDisplayedCharts, line', toLineChartDataRef.current);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi;
  let candlestickSeries: ISeriesApi<'Candlestick'>;
  let initData: CandlestickData[];

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

  const handleResize = () => {
    chart.applyOptions({width: Number(chartContainerRef?.current?.clientWidth) - 50});
  };

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

    return base;
  };

  const initCandlestickData = ({
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

  // Info: 1.2 Initialize the 30 cleaned data (20230330 - Shirley)
  const initJob = ({data, dataSize, timespan}: ITrimCandlestickData) => {
    const spec = createBaseArray({dataSize, timespan});

    // // Deprecated: before merging into develop (20230329 - Shirley)
    // // eslint-disable-next-line no-console
    // console.log('spec in initJob', JSON.parse(JSON.stringify(spec)));
    // // eslint-disable-next-line no-console
    // console.log('data in initJob', JSON.parse(JSON.stringify(data)));
    // // eslint-disable-next-line no-console
    // console.log(
    //   'market context data in initJob',
    //   JSON.parse(JSON.stringify(marketCtx.candlestickChartData))
    // );

    // ToDo: Get data from context and move to update when context is updated (20230330 - Shirley)
    // const raw = data.map(d => ({
    //   time: (d.x.getTime() / 1000) as UTCTimestamp,
    //   open: d.y.open,
    //   high: d.y.high,
    //   low: d.y.low,
    //   close: d.y.close,
    // }));
    const raw = getDummyCandlestickChartData(50, TimeSpanUnion._1s).map(d => ({
      time: (d.x.getTime() / 1000) as UTCTimestamp,
      open: d.y.open,
      high: d.y.high,
      low: d.y.low,
      close: d.y.close,
    }));

    const filtered = initCandlestickData({dataArray: raw, baseArray: spec});

    // // Deprecated: before merging into develop (20230329 - Shirley)
    // // eslint-disable-next-line no-console
    // console.log('raw dummy data in initJob', JSON.parse(JSON.stringify(raw)));
    // // eslint-disable-next-line no-console
    // console.log('filtered data in initJob', JSON.parse(JSON.stringify(filtered)));

    return filtered as CandlestickData[];
  };

  // ToDo: Info: 1.2 fetch candlestick chart data from market context (20230330 - Shirley)
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

  // Get candlestick data from market context, check the data format and merge with `initData`
  const mergeCandlestickData = ({
    dataArray,
    baseArray,
  }: {
    dataArray: CandlestickData[];
    baseArray: CandlestickData[];
  }) => {
    // eslint-disable-next-line no-console
    // console.log('baseArray', JSON.parse(JSON.stringify(baseArray)));
    const data = [...dataArray];
    const base = [...baseArray];

    const lastTime = base[base.length - 1].time;
    const validData = data
      .filter(data => {
        return (
          data.time &&
          typeof data.open === 'number' &&
          typeof data.high === 'number' &&
          typeof data.low === 'number' &&
          typeof data.close === 'number'
        );
      })
      .filter(data => data.time === Number(lastTime) + 1);

    const result = [...base, ...validData];
    return result;
    // const dataFromCtx = marketCtx.candlestickChartData;
    // if (dataFromCtx === null) {
    //   return;
    // }
    // // Info: Transform the data to the format that the chart can accept (20230330 - Shirley)
    // const temp = dataFromCtx.slice(-50).map(d => ({
    //   time: (d.x.getTime() / 1000) as UTCTimestamp,
    //   open: d.y.open,
    //   high: d.y.high,
    //   low: d.y.low,
    //   close: d.y.close,
    // }));
    // // Info: Check if the data is valid: 1. data format 2. no repeated data (20230330 - Shirley)
    // const validData = temp
    //   .filter(data => {
    //     return (
    //       data.time &&
    //       typeof data.open === 'number' &&
    //       typeof data.high === 'number' &&
    //       typeof data.low === 'number' &&
    //       typeof data.close === 'number'
    //     );
    //   })
    //   .filter(data => {
    //     // Check if the data already exists in the chart
    //     const index = initData?.findIndex(d => d.time === data.time);
    //     return index < 0;
    //   }) as CandlestickData[];
    // initData = [...initData, ...validData];
    // eslint-disable-next-line no-console
    // console.log('market ctx data in merge function', JSON.parse(JSON.stringify(dataFromCtx)));
    // eslint-disable-next-line no-console
    // console.log('init data in merge function', JSON.parse(JSON.stringify(initData)));
  };

  const updateChart = () => {
    // mergeCandlestickData();
    let currentIndex = 0;

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
      currentIndex++;

      if (currentIndex === 4) {
        currentIndex = 0;

        const randomCandle = generateRandomCandle().map(d => ({
          time: (d.x.getTime() / 1000) as UTCTimestamp,
          open: d.y.open,
          high: d.y.high,
          low: d.y.low,
          close: d.y.close,
        })) as CandlestickData[];

        //   // ToDo: renew chart with new data from context (20230330 - Shirley)
        // mergeCandlestickData({
        //   // dataArray: marketCtx?.candlestickChartData ?? [],
        //   dataArray: randomCandle,
        //   baseArray: initData,
        // });

        initData = [...initData, randomCandle[randomCandle.length - 1]];

        candlestickSeries.setData(initData);

        // eslint-disable-next-line no-console
        console.log('index===5', currentIndex, initData);
      } else {
        const randomCandle = generateRandomCandle().map(d => ({
          time: (d.x.getTime() / 1000) as UTCTimestamp,
          open: d.y.open,
          high: d.y.high,
          low: d.y.low,
          close: d.y.close,
        })) as CandlestickData[];

        const mergedData = mergeCandlestickData({
          dataArray: randomCandle,
          baseArray: initData,
        });

        initData = [...mergedData];

        candlestickSeries.setData(initData);

        // candlestickSeries.update(randomCandle[randomCandle.length - 1]);
        // eslint-disable-next-line no-console
        console.log('index<5', currentIndex, initData);
      }

      // const randomCandle = generateRandomCandle().map(d => ({
      //   time: (d.x.getTime() / 1000) as UTCTimestamp,
      //   open: d.y.open,
      //   high: d.y.high,
      //   low: d.y.low,
      //   close: d.y.close,
      // })) as CandlestickData[];

      // // FIXME: Need to update the initData with one candlestick data one second (no repeated data)
      // initData = [...initData, randomCandle[randomCandle.length - 1]];
      // candlestickSeries.setData(initData);

      // candlestickSeries.update(randomCandle[randomCandle.length - 1]);

      // // TODO: Get the lastest price position and locate a lottie (20230329 - Shirley)
      // const lastPrice = randomCandle[randomCandle.length - 1].close;
      // console.log('object', randomCandle[randomCandle.length - 1]);
      // console.log('close coordinate', candlestickSeries.priceToCoordinate(lastPrice));
    };

    const trimmedData = parseCandlestickData({
      data: marketCtx.candlestickChartData ?? [],
      dataSize: 30,
      timespan: 1,
    });

    const lwcData = trimmedData.map((d: ICandlestickData) => {
      return {
        time: (d.x.getTime() / 1000) as UTCTimestamp,
        open: d.y.open,
        high: d.y.high,
        low: d.y.low,
        close: d.y.close,
      };
    }) as CandlestickData[];

    mergeCandlestickData({dataArray: lwcData, baseArray: initData});

    updateData();
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

    // Info: 1.4 draw candlestick chart with data (20230330 - Shirley)
    initChart();

    // Info: 2. Periodical job (20230330 - Shirley)
    // ToDo: (20230330 - Shirley) updates (vs useEffect)
    const intervalId = setInterval(updateChart, 1000);

    // eslint-disable-next-line no-console
    console.log('init data in useEffect', initData);

    // Get the data drawn on the chart
    // const data = candlestickSeries.dataByIndex(0);
    // const data = candlestickSeries.barsInLogicalRange({from: 0, to: 100}); // get time
    // const data = candlestickSeries.seriesType();

    // // eslint-disable-next-line no-console
    // console.log('candlestick series in chart', JSON.parse(JSON.stringify(data)));

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      chart.remove();
    };
    // }
  }, []); // chartContainerRef

  // /* ToDO: Get candlestick data from ctx (20230330 - Shirley) */
  // useEffect(() => {
  //   const trimmedData = parseCandlestickData({
  //     data: marketCtx.candlestickChartData ?? [],
  //     dataSize: 30,
  //     timespan: 1,
  //   });

  //   const lwcData = trimmedData
  //     .filter(({y}) => y.open !== null && y.high !== null && y.low !== null && y.close !== null)
  //     .map((d: ICandlestickData) => {
  //       return {
  //         time: (d.x.getTime() / 1000) as UTCTimestamp,
  //         open: d.y.open,
  //         high: d.y.high,
  //         low: d.y.low,
  //         close: d.y.close,
  //       };
  //     });

  //   // FIXME: 執行到這邊的時候，initData 還是空的 (20230330 - Shirley)
  //   // mergeCandlestickData({dataArray: lwcData, baseArray: initData});

  //   // Deprecated: before merging into develop (20230329 - Shirley)
  //   // eslint-disable-next-line no-console
  //   console.log('market data which comply with data spec', JSON.parse(JSON.stringify(lwcData)));
  //   // eslint-disable-next-line no-console
  //   console.log('whole data from ctx', JSON.parse(JSON.stringify(marketCtx.candlestickChartData)));
  // }, [marketCtx.candlestickChartData]);

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
