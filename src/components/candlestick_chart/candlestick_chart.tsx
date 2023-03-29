/** Info: (20230329 - Shirley)
 * Draw a live candlestick chart with Tradingview Lightweight Charts Library
 * 1. Initial job
 * 1.1 setup chart container and chart options with window size
 * 1.2 fetch candlestick chart data from market context
 * 1.3 data cleaning
 * 1.4 draw candlestick chart with data
 * 2. Periodically job
 * 2.1 renew chart with candlestick chart data in marketcontext is updated
 * 2.2 data cleaning
 * 2.3 draw candlestick chart with data
 */

import React, {useState, useContext, useEffect, useRef} from 'react';
import {createChart, CrosshairMode, ColorType} from 'lightweight-charts';
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
    ...Array.from({length: nullNum}, (_, i) => ({
      x: new Date(nowSecond + unitOfLive * nullTime),
      y: {
        open: null,
        high: null,
        low: null,
        close: null,
      },
    })),
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

  // Deprecated: before merging into develop (20230323 - Shirley)
  // const candlestickChartDataFromCtx =
  //   marketCtx.candlestickChartData !== null
  //     ? marketCtx.candlestickChartData?.map(d => ({
  //         x: d.x,
  //         y: [
  //           d.open ? d.open : null,
  //           d.high ? d.high : null,
  //           d.low ? d.low : null,
  //           d.close ? d.close : null,
  //         ],
  //       }))
  //     : [];
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
      time: d.x,
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

  // Till: (20230329 - Shirley)
  // console.log('before isDisplayedCharts, marketCtx', candlestickChartDataFromCtx);
  // console.log('before isDisplayedCharts, latest price', toLatestPriceLineDataRef.current);
  // console.log('before isDisplayedCharts, candle', toCandlestickChartDataRef.current);
  // console.log('before isDisplayedCharts, line', toLineChartDataRef.current);

  // const {backgroundColor = 'black', candleColor = 'white', textColor = 'white'} = colors;
  const colors = {
    backgroundColor: 'black',
    candleColor: 'white',
    textColor: 'white',
  };

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // const handleResize = () => {
      //   chart.applyOptions({width: chartContainerRef.current.clientWidth});
      // };

      const chartOptions = {
        width: 1000,
        height: 300,
        layout: {
          background: {type: ColorType.VerticalGradient, color: colors.backgroundColor},
          textColor: colors.textColor,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: LINE_GRAPH_STROKE_COLOR.UP,
        downColor: LINE_GRAPH_STROKE_COLOR.DOWN,
        borderVisible: false,
        wickUpColor: LINE_GRAPH_STROKE_COLOR.UP,
        wickDownColor: LINE_GRAPH_STROKE_COLOR.DOWN,
      });

      //  {time: '2023-03-28', open: null, high: null, low: null, close: null},
      const dummyData = [
        {time: '2023-03-19', open: 75.16, high: 84.84, low: 36.16, close: 145.72},
        {time: '2023-03-20', open: 55.16, high: 72.84, low: 36.16, close: 25.72},
        {time: '2023-03-21', open: 45.16, high: 92.84, low: 36.16, close: 32.72},
        {time: '2023-03-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72},
        {time: '2023-03-23', open: 45.12, high: 53.9, low: 45.12, close: 48.09},
        {time: '2023-03-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29},
        {time: '2023-03-25', open: 68.26, high: 68.26, low: 59.04, close: 60.5},
        {time: '2023-03-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04},
        {time: '2023-03-27', open: 91.04, high: 121.4, low: 82.7, close: 111.4},
        {time: '2023-03-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25},
      ];

      // Deprecated: before merging into develop (20230329 - Shirley)
      // eslint-disable-next-line no-console
      console.log('lwcdata', lwcData);
      // eslint-disable-next-line no-console
      console.log('lwc data in JSON', JSON.stringify(lwcData));
      candlestickSeries.setData(dummyData);

      const generateRandomCandle = () => {
        const now = new Date();
        const timestamp = now.toISOString().split('T')[0];
        const price = (Math.random() * 100).toFixed(2);

        return {
          time: timestamp,
          open: Number(price),
          high: Number(price) + Math.random(),
          low: Number(price) - Math.random(),
          close: Number(price) + Math.random() - 0.5,
        };
      };

      const updateChart = () => {
        const randomCandle = generateRandomCandle();
        candlestickSeries.update(randomCandle);
      };

      // const intervalId = setInterval(updateChart, 200);

      // window.addEventListener('resize', handleResize);

      chart.timeScale().fitContent();

      return () => {
        // window.removeEventListener('resize', handleResize);
        // clearInterval(intervalId);
        chart.remove();
      };
    }
  }, []);

  return (
    <>
      {/* <div className="-ml-5 w-full lg:w-7/10">Candlestick Chart with D3.js</div> */}
      <div className="ml-5 w-full lg:w-7/10">
        <div ref={chartContainerRef}></div>
      </div>
    </>
  );
}
