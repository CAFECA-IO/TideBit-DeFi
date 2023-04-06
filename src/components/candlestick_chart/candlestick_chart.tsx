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
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
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

// Get candlestick data from market context, check the data format and merge with `initData`
const candlestickDataCleaning = (dataArray: CandlestickData[]) => {
  const data = [...dataArray];

  // TODO: 1.檢查high、low 2.檢查資料時間是否重複，重複就整理 high、low (合併為一筆) 3. (20230331 - Shirley)

  return data;
};

// 確認 market context real-time data 能更新 component 的資料->在 market context 裡每0.2秒更新假資料

interface IChartSpecProps {
  timespan: number;
  dataSize: number;
  chartHeight: number;
  chartWidth: number;
}

// ToDo: 從 props 拿資料；圖表樣式、長寬、時間區間、資料數量
const createSpec = ({timespan, dataSize, chartHeight, chartWidth}: IChartSpecProps) => {
  const locale: LocalizationOptions = {
    locale: 'zh-TW',
    dateFormat: 'yyyy-MM-dd',
  };

  const chartOptions = {
    width: chartWidth,
    height: chartHeight,
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

  const getLastTime = () => {
    const now = new Date().getTime();
    return now - (now % (timespan * 1000));
  };

  const targetTime = getLastTime() / 1000 - (dataSize - 1) * timespan;

  return {targetTime, chartOptions};
};

const filterCandlestickData = ({
  dataArray,
  targetTime,
}: {
  dataArray: CandlestickData[];
  targetTime: number;
}) => {
  const data = [...dataArray];

  const result = data.filter(d => {
    return Number(d.time) >= targetTime;
  });

  return result;
};

const tuningTimezone = (time: number) => {
  // Get the timezone of the client browser
  const tzOffset = new Date().getTimezoneOffset() * 60;
  const result = time - tzOffset;
  return result;
};

const tuningTzCandlestickData = (data: CandlestickData) => {
  const time = tuningTimezone(Number(data.time));
  return {...data, time};
};

const tuningTzCandlestickDataArray = (dataArray: CandlestickData[]) => {
  const data = [...dataArray];

  const result = data.map(tuningTzCandlestickData);

  return result;
};

const generateRandomCandle = ({time, lastPrice = 1288}: {time?: Date; lastPrice?: number}) => {
  const rnd = Math.random() / 1.2;
  const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
  const price = lastPrice * ts;

  const open = price * (1 + (Math.random() - 0.5) / 10);
  const close = price * (1 + (Math.random() - 0.5) / 10);
  const high = Math.max(open, close) * (1 + Math.random() / 10);
  const low = Math.min(open, close) * (1 - Math.random() / 10);

  const currentTime = time ? time?.getTime() : new Date().getTime();
  const timeOffset = currentTime - (currentTime % 1000);
  const dateOffset = new Date(timeOffset);

  const candle: ICandlestickData = {
    x: dateOffset,
    y: {
      open: open,
      high: high,
      low: low,
      close: close,
    },
  };

  return candle;
};

const toCandlestickData = (data: ICandlestickData): CandlestickData => {
  return {
    time: (data.x.getTime() / 1000) as UTCTimestamp,
    open: data.y.open || 0,
    high: data.y.high || 0,
    low: data.y.low || 0,
    close: data.y.close || 0,
  };
};

// ToDo: 從外面傳進來的參數: 1.timespan 2.style of chart
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

  const width =
    globalCtx.layoutAssertion === 'desktop'
      ? globalCtx.width * 0.6 - 2000 / globalCtx.width + (globalCtx.width - 1150) * 0.5
      : globalCtx.width * 0.9;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi;

  const handleResize = () => {
    chart.applyOptions({width: Number(chartContainerRef?.current?.clientWidth) - 50});
  };

  const tempFunc = () => {
    // Info: initChart
    let candlestickSeries: ISeriesApi<'Candlestick'>;

    const {targetTime, chartOptions} = createSpec({
      dataSize: 30,
      timespan: 1,
      chartWidth: width, // ToDo: candlestickChartWidth
      chartHeight: 300, // ToDo: candlestickChartHeight
    });

    // ToDo: data from market context (20230331 - Shirley)
    const raw = getDummyCandlestickChartData(50, TimeSpanUnion._1s).map(d => ({
      time: (d.x.getTime() / 1000) as UTCTimestamp,
      open: d.y.open,
      high: d.y.high,
      low: d.y.low,
      close: d.y.close,
    })) as CandlestickData[];

    const cleanedData = candlestickDataCleaning(raw);

    const filtered = filterCandlestickData({dataArray: cleanedData, targetTime: targetTime});

    const tuned = tuningTzCandlestickDataArray(filtered) as CandlestickData[];

    if (chartContainerRef.current) {
      // Info: Draw
      chart = createChart(chartContainerRef.current, chartOptions);

      candlestickSeries = chart.addCandlestickSeries({
        // ToDo: `createSpec` 可以讀外面的參數，但這邊直接拿createSpec
        upColor: LINE_GRAPH_STROKE_COLOR.UP,
        downColor: LINE_GRAPH_STROKE_COLOR.DOWN,
        borderVisible: false,
        wickUpColor: LINE_GRAPH_STROKE_COLOR.UP,
        wickDownColor: LINE_GRAPH_STROKE_COLOR.DOWN,
      });

      candlestickSeries.setData(tuned);

      chart.timeScale().fitContent();

      // Info: updateChart in period
      // ToDo: 只要有新的資料就更新，不用 setInterval (20230331 - Shirley)
      const intervalId = setInterval(() => {
        try {
          const option = {
            lastPrice: filtered[filtered.length - 1].close,
          };

          // ToDo: data from market context (20230331 - Shirley)
          const newCandleRaw = generateRandomCandle(option);

          const newCandle = toCandlestickData(newCandleRaw);
          const tunedNewCandle = tuningTzCandlestickData(newCandle) as CandlestickData;

          candlestickSeries.update(tunedNewCandle);
        } catch (err) {
          // ToDo: re render (20230331 - Shirley)
        }
      }, 200);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(intervalId);
        chart.remove();
      };
    }
  };

  useEffect(() => {
    return tempFunc();
  }, []);

  return (
    <>
      <div className="ml-5 pb-20 pt-20 lg:w-7/10 lg:pb-5 lg:pt-14">
        <div ref={chartContainerRef} className="hover:cursor-crosshair"></div>
      </div>
    </>
  );
}
