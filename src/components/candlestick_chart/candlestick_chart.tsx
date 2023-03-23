/*Deprecated: (20230322 - Shirley) before merging into develop */
/*eslint-disable no-console */
import React, {useState, useContext, useEffect, useRef} from 'react';
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
import {randomFloatFromInterval, randomIntFromInterval, timestampToString} from '../../lib/common';
import {
  ICandlestickData,
  getDummyCandlestickChartData,
} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
import {
  VictoryScatter,
  VictoryLabel,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryCursorContainer,
} from 'victory';
import {AppContext} from '../../contexts/app_context';
import Image from 'next/image';
import {GlobalContext} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {
  MAX_PRICE_TRADING_CHART_ONE_SEC,
  MIN_PRICE_TRADING_CHART_ONE_SEC,
  TRADING_CHART_PRICE_LIMIT_ONE_SEC,
} from '../../constants/config';

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

export interface IStaleCandlestickChartData {
  x: Date;
  y: [...(number | null)[]];
}

export const updateDummyCandlestickChartData = (
  data: IStaleCandlestickChartData[]
): {x: Date; y: (number | null)[]}[] => {
  const n = 80;
  const chartBlank = 1.68;
  const dummyDataSize = 80;
  const unitOfLive = 1000;

  const now = new Date().getTime();

  const origin = [...data].slice(1);

  const count = countNullArrays(origin);

  /* Till: (20230327 - Shirley)
   const originWithoutNull = originalData.slice(0, -count);
   */
  const originWithoutNull = origin.filter(obj => !obj.y.includes(null));

  const lastTime = originWithoutNull[originWithoutNull.length - 1]?.x.getTime() as number;
  const lastPoint = originWithoutNull[originWithoutNull.length - 1]?.y[3] as number;

  const nowSecond = now - (now % unitOfLive);

  const newYs: (number | null)[] = new Array(4).fill(0).map(v => {
    const price = lastPoint * randomFloatFromInterval(0.95, 1.05, 2);

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const newCandlestickData: {x: Date; y: (number | null)[]} = {
    x: new Date(nowSecond - 1 * unitOfLive),
    y: newYs,
  };

  const addition = n / chartBlank;

  const nullNum = 1;
  const nullTime = 10;

  const withNullData = [
    ...originWithoutNull,
    newCandlestickData,
    ...Array.from({length: nullNum}, (_, i) => ({
      x: new Date(nowSecond + unitOfLive * nullTime),
      y: [null, null, null, null],
    })),
  ];

  return withNullData;
};

function countNullArrays(arr: {y: any[]}[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].y) && arr[i].y.every(v => v === null)) {
      count++;
    }
  }
  return count;
}

export interface IProcessCandlestickData {
  data: ICandlestickData[];
  requiredDataNum: number;
}

// TODO: (20230313 - Shirley) after getting the complete data from Context, process it to the required format
export function processCandlestickData({data, requiredDataNum}: IProcessCandlestickData) {
  const origin = [...data].map(d => ({
    x: d.x,
    y: [
      d.open ? d.open : null,
      d.high ? d.high : null,
      d.low ? d.low : null,
      d.close ? d.close : null,
    ],
  }));
  // const nullNum = countNullArrays(origin);
  const nullNum = 1;
  const nullTime = 10;

  const unitOfLive = 1000;
  const now = new Date().getTime();
  const nowSecond = now - (now % unitOfLive);

  const originWithoutNull = origin.filter(obj => !obj.y.includes(null));
  const latestData = originWithoutNull.slice(-requiredDataNum);
  const toCandlestickData = [
    ...latestData,
    ...Array.from({length: nullNum}, (_, i) => ({
      // x: new Date(nowSecond + unitOfLive * (i + 1)),
      x: new Date(nowSecond + unitOfLive * nullTime),
      y: [null, null, null, null],
    })),
  ];

  return toCandlestickData;
}

export interface ITrimCandlestickData {
  // data: IStaleCandlestickChartData[];
  data: ICandlestickData[];
  dataSize: number;
  timespan: number;
}

export function parseCandlestickData({data, dataSize, timespan}: ITrimCandlestickData) {
  // const timespan = 1000;
  // const dataSize = 30;

  const createBaseArray = () => {
    // const getLastTime = () => {
    //   const now = new Date().getTime();
    //   return now - (now % timespan);
    // };

    const getLastTime = () => {
      return data[data.length - 1]?.x.getTime() as number;
    };

    // const getLastTime = new Date(data[0].x).getTime();
    // const getLastTime = data[0]?.x.getTime();

    const base = new Array(dataSize).fill(0).map((v, i) => {
      const eachTime = new Date(getLastTime() - (dataSize - i) * timespan);
      const eachTimestamp = eachTime.getTime() / 1000;

      return {
        // i,
        // timestamp: eachTimestamp,
        x: eachTime,
        open: null,
        high: null,
        low: null,
        close: null,
      };
    });
    // FIXME: It'll not be `null`
    console.log('base array in baseArray', base);
    return base;
  };

  const filterCandlestickData = (data: ICandlestickData[], baseArray: ICandlestickData[]) => {
    let previousClose = 0;
    // let previousCandle:ICandlestickData = {x: baseArray[0].x, open: 0, high: 0, low: 0, close: 0}
    console.log('data from input', data);

    const dataWithBaseX = data.slice(-30).map((d, i) => {
      return {
        x: baseArray[i]?.x,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      };
      // const baseTime = baseArray[i]?.x.getTime();
      // const dataTime = d.x.getTime();
      // if (baseTime !== dataTime) {
      // return {
      //   x: baseArray[i]?.x,
      //   open: d.open,
      //   high: d.high,
      //   low: d.low,
      //   close: d.close,
      // };
      // }
      // return d;
    });

    console.log('data with x', dataWithBaseX);

    for (let i = 0; i < baseArray.length; i++) {
      // const index = data.findIndex(d => {
      const index = dataWithBaseX.findIndex(d => {
        const baseTime = baseArray[i]?.x.getTime();
        const dataTime = d.x.getTime();
        // console.log('baseTime: ', baseTime);
        // console.log('dataTime: ', dataTime);
        return baseTime === dataTime;
      });
      // console.log('index: ', index);
      if (index >= 0) {
        // data[index].close !== null ? (previousClose = data[index].close) : previousClose;

        baseArray[i].open = data[index].open;
        baseArray[i].high = data[index].high;
        baseArray[i].low = data[index].low;
        baseArray[i].close = data[index].close;

        previousClose = data[index].close || previousClose;

        // previousCandle = baseArray[i]
      } else if (previousClose !== null) {
        baseArray[i].open = previousClose;
        baseArray[i].high = previousClose;
        baseArray[i].low = previousClose;
        baseArray[i].close = previousClose;
      }
    }

    const result = [...baseArray];
    console.log('result: ', result);

    return result;
  };

  const processCandlestickData = (candles: ICandlestickData[]) => {
    const nullTime = 10;

    const baseArray = createBaseArray();
    const filteredData = filterCandlestickData(candles, baseArray);
    const latestData = filteredData.concat({
      x: new Date(filteredData[filteredData.length - 1].x.getTime() + timespan * nullTime),
      open: null,
      high: null,
      low: null,
      close: null,
    });

    // console.log('base time array: ', baseArray);
    // console.log('filtered data: ', filteredData);

    return latestData;
  };

  const processedData = processCandlestickData(
    // data.slice(-50).map(d => ({x: d.x, open: d.y[0], high: d.y[1], low: d.y[2], close: d.y[3]}))
    data.slice(-50).map(d => ({x: d.x, open: d.open, high: d.high, low: d.low, close: d.close}))
  );

  // console.log('processed data: ', processedData);

  return processedData;

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
    timespan: 1000,
  });

  // const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
  //   | {
  //       x: Date;
  //       y: [...(number | null)[]];
  //     }[]
  //   | undefined
  // >(trimmedData);

  const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
    useStateRef<
      | {
          x: Date;
          open: number | null;
          high: number | null;
          low: number | null;
          close: number | null;
        }[]
      | undefined
    >(trimmedData);

  const [toLineChartData, setToLineChartData, toLineChartDataRef] = useStateRef<ILineChartData[]>(
    () =>
      candlestickChartDataFromCtx.map((data, i) => ({
        x: data.x,
        y: data.close,
      }))
  );

  const [toLatestPriceLineData, setToLatestPriceLineData, toLatestPriceLineDataRef] = useStateRef<
    ILineChartData[]
  >(
    toLineChartData?.map(data => ({
      x: data?.x,
      y: toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y,
    }))
  );

  // const ys: number[] = trimmedData
  //   ? trimmedData.reduce(
  //       (acc: number[], curr) => {
  //         if (curr.open === null || curr.high === null || curr.low === null || curr.close === null)
  //           return;

  //         acc.push(curr.open, curr.high, curr.low, curr.close);
  //         return acc;
  //       },
  //       []
  //     )
  //   : [];
  const ys = trimmedData
    ? (trimmedData
        .filter(
          (data: ICandlestickData) =>
            data.open !== null && data.high !== null && data.low !== null && data.close !== null
        )
        .map((data: ICandlestickData) => [data.open, data.high, data.low, data.close])
        .flat() as number[])
    : [];

  // const ys = trimmedData ? (trimmedData.flatMap(d => d.y.filter(y => y !== null)) as number[]) : [];

  const max = ys.length > 0 ? Math.max(...ys) : null;
  const min = ys.length > 0 ? Math.min(...ys) : null;

  const maxNumber = max && min ? TRADING_CHART_PRICE_LIMIT_ONE_SEC * (max - min) + max : 100;
  const minNumber = max && min ? min - TRADING_CHART_PRICE_LIMIT_ONE_SEC * (max - min) : 0;

  /* Deprecated: (20230322 - Shirley) it's done in other branch
  const userOpenPrice = randomIntFromInterval(minNumber ?? 100, maxNumber ?? 1000);
  const userOpenPriceLine = toLatestPriceLineData?.map(data => ({
    x: data?.x,
    y: 10000,
  })); */
  /**Deprecated: (20230322 - Shirley) it's done in other branch
  const userOpenPriceLine1 =
    userCtx.openCFDs.length > 0
      ? toLatestPriceLineData?.map(data => ({
          x: data?.x,
          y: userCtx?.openCFDs[0].openPrice + 5000,
        }))
      : null;
  const nestedLine1 = [userOpenPriceLine1];
  // const userOpenPriceLine2 = toLatestPriceLineData?.map(data => ({
  //   x: data?.x,
  //   y: userCtx?.openCFDs[1].openPrice + 6000,
  // }));
  // const userOpenPriceLine3 = toLatestPriceLineData?.map(data => ({
  //   x: data?.x,
  //   y: userCtx?.openCFDs[2].openPrice + 7000,
  // }));
  // const userOpenPriceLine4 = [userOpenPriceLine1, userOpenPriceLine2, userOpenPriceLine3];

  console.log('nested line1', nestedLine1);
  // const userOpenPriceLine = new Array(30).fill(0).map((_, index) => ({
  //   x: new Date(new Date().getTime() - index * 1000),
  //   y: a === 1 ? 1000 + 10 * index : 1000 + 20 * index,
  // }));
  console.log('open cfd', userCtx.openCFDs);
  */

  /* Deprecated: (20230322 - Shirley) it's done in other branch
  const userLines = Array.from({length: 1}, (_, index) => (
    <VictoryLine
      key={index}
      style={{
        data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1, strokeDasharray: '2,2'},
        // parent: { border: '1px solid #ccc' },
      }}
      data={userOpenPriceLine}
    />
  ));

  // Deprecated: (20230322 - Shirley) it's done in other branch
  const priceline = userCtx.openCFDs.map((cfd, index) => (
    <VictoryLine
      key={index}
      style={{
        data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1, strokeDasharray: '2,2'},
      }}
      data={toLatestPriceLineData?.map(data => ({
        x: data?.x,
        y: cfd.openPrice + 5000,
      }))}
    />
  ));

  const userLine = (
    <VictoryLine
      style={{
        data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1, strokeDasharray: '2,2'},
      }}
      data={userOpenPriceLine}
    />
  );*/
  /* TODO: (20230313 - Shirley) Open closed modal
  const userPricePoint = (
    <VictoryScatter
      style={{data: {fill: 'transparent'}, labels: {background: 'transparent'}}}
      data={userOpenPriceLine}
      labels={({datum}) =>
        datum.x === userOpenPriceLine[userOpenPriceLine.length - 1].x
          ? `🔽Position $${datum.y?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}　Close`
          : ``
      }
      labelComponent={
        <VictoryLabel
          className="hover:cursor-pointer hover:opacity-80"
          events={{
            onClick: e => {
              globalCtx.dataPositionClosedModalHandler({
                openCfdDetails: openCfdDetails,
                latestProps: {
                  renewalDeadline:
                    new Date().getTime() / 1000 + POSITION_PRICE_RENEWAL_INTERVAL_SECONDS,
                  latestClosedPrice:
                    openCfdDetails.typeOfPosition === TypeOfPosition.BUY
                      ? randomIntFromInterval(
                          marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 0.75,
                          marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
                        )
                      : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
                      ? randomIntFromInterval(
                          marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.1,
                          marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
                        )
                      : 99999,
                  // latestPnL: {
                  //   type: randomIntFromInterval(0, 100) <= 2 ? ProfitState.PROFIT : ProfitState.LOSS,
                  //   value: randomIntFromInterval(0, 1000),
                  // },
                },
              });

              globalCtx.visiblePositionClosedModalHandler();
            },
          }}
          x={Number(candlestickChartWidth) - 115}
          style={{
            fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
            fontSize: 10,
            fontFamily: 'barlow',
          }}
          backgroundStyle={{
            fill: LINE_GRAPH_STROKE_COLOR.LONG,
          }}
          backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}} // Info: sets the background padding
        />
      }
    />
  );
  */

  useEffect(() => {
    if (!appCtx.isInit) return;
    if (marketCtx.candlestickChartData === null) return;
    // Deprecated: before merge into develop (tzuhan 20230322)
    console.log(`Component CandlestickChart from marketCtx`, marketCtx.candlestickChartData);
    // if (!candlestickChartDataRef.current) {
    // setCandlestickChartData(() =>
    //   trimCandlestickData({
    //     data:
    //       marketCtx?.candlestickChartData?.map(d => ({
    //         x: d.x,
    //         y: [
    //           d.open ? d.open : null,
    //           d.high ? d.high : null,
    //           d.low ? d.low : null,
    //           d.close ? d.close : null,
    //         ],
    //       })) ?? [],
    //     dataSize: 30,
    //     timespan: 1000,
    //   })
    // );
    // }

    const trimmedData = parseCandlestickData({
      data: marketCtx?.candlestickChartData ?? [],
      dataSize: 30,
      timespan: 1000,
    });

    setToCandlestickChartData(
      trimmedData
      // candlestickChartDataRef.current?.map(data => ({
      //   x: data.x,
      //   open: data.y[0],
      //   high: data.y[1],
      //   low: data.y[2],
      //   close: data.y[3],
      // }))
    );
    console.log('display data', toCandlestickChartDataRef.current);

    // Till: (20230410 - Shirley)
    // console.log('data put into chart', toCandlestickChartDataRef.current);

    const toLineChartData =
      // candlestickChartDataRef.current?.map((data, i) => ({
      toCandlestickChartDataRef.current?.map((data, i) => ({
        x: data.x,
        y: data.close,
      })) ?? [];
    setToLineChartData(toLineChartData);

    const latestPrice = toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y;
    const toLatestPriceLineData = toLineChartData?.map(data => ({
      x: data?.x,
      y: latestPrice,
    }));

    setToLatestPriceLineData(toLatestPriceLineData);
    /*  Deprecated: (20230322 - Shirley) delete it before merging into develop

    // }

    //     const setStateInterval = setInterval(() => {
    //       if (!candlestickChartDataRef?.current) return;

    //       const updatedCandlestickChartData = updateDummyCandlestickChartData(
    //         candlestickChartDataRef?.current
    //       );

    //       setCandlestickChartData(updatedCandlestickChartData);

    //       const toCandlestickChartData = updatedCandlestickChartData?.map(data => ({
    //         x: data.x,
    //         open: data.y[0],
    //         high: data.y[1],
    //         low: data.y[2],
    //         close: data.y[3],
    //       }));

    //       /* TODO: (20230313 - Shirley) Sometimes, the candlestick overlays with another candlestick (20230310 - Shirley)/
    //       // console.log('data put into chart', toCandlestickChartDataRef.current);
    //       // console.log('market Ctx', marketCtx.candlestickChartData);
    //       // console.log('market Ctx sliced', marketCtx.candlestickChartData?.slice(-30));
    //       // console.log('market Ctx stringified', JSON.stringify(marketCtx.candlestickChartData));
    // 

    //       setToCandlestickChartData(toCandlestickChartData);

    // const toLineChartData = updatedCandlestickChartData.map((data, i) => ({
    //   x: data.x,
    //   y: data.y[3],
    // }));
    // setToLineChartData(toLineChartData);

    // const latestPrice = toLineChartData?.[toLineChartData.length - NULL_ARRAY_NUM - 1]?.y;
    // const toLatestPriceLineData = toLineChartData?.map(data => ({
    //   x: data?.x,
    //   y: latestPrice,
    // }));

    // setToLatestPriceLineData(toLatestPriceLineData);
    //     }, 1000 * 1);
    */

    return () => {
      /*  Deprecated: (20230322 - Shirley) delete it before merging into develop
      // clearInterval(setStateInterval);*/
    };
  }, [marketCtx.candlestickChartData]);

  // TODO: VictoryThemeDefinition to get the type (20230310 - Shirley)
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: LIGHT_GRAY_COLOR,
          fontSize: 10,
          fontFamily: 'barlow',
          padding: 5,
        },
        axis: {
          stroke: LIGHT_GRAY_COLOR,
        },
        grid: {
          stroke: 'none',
        },
      },
    },
    line: {
      style: {
        data: {
          stroke: LIGHT_GRAY_COLOR,
          strokeWidth: 1,
        },
      },
    },
  };

  const isDisplayedCharts =
    toCandlestickChartDataRef.current && toCandlestickChartDataRef.current?.length > 0 ? (
      <VictoryChart
        theme={chartTheme}
        minDomain={{
          y: minNumber !== null ? minNumber : undefined,
        }}
        maxDomain={{
          y: maxNumber !== null ? maxNumber : undefined,
        }} // INFO: measure the biggest number to decide the y-axis (20230322 - Shirley)
        // Till: (20230327 - Shirley)  // domainPadding={{x: 1}}
        width={Number(candlestickChartWidth)}
        height={Number(candlestickChartHeight)}
        /* Till: (20230327 - Shirley)
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({datum}) =>
                `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
              }
              labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
            />
          }
        */
      >
        {/* Till: (20230327 - Shirley) 
        <VictoryLabel
        x={25}
        y={24}
        style={{stroke: EXAMPLE_BLUE_COLOR}}
        text={`${(d: any) => d.datum}`}
      /> */}
        <VictoryAxis
          // Till: (20230327 - Shirley) // scale={{x: 'time'}}
          style={{
            axis: {stroke: 'none'},
          }}
          tickFormat={t => ` ${timestampToString(t / 1000).time}`}
        />
        <VictoryAxis
          tickLabelComponent={<VictoryLabel dx={45} />}
          offsetX={Number(candlestickChartWidth) - 50}
          dependentAxis
          // Till: (20230409 - Shirley) // tickValues={[minNumber, maxNumber]}
        />

        {candlestickOn && (
          <VictoryCandlestick
            animate={{
              duration: 0,
              onExit: {
                duration: 0,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {
                fillOpacity: 1,

                stroke: (d: any) =>
                  d.close > d.open ? TypeOfPnLColorHex.LOSS : TypeOfPnLColorHex.PROFIT,
                strokeWidth: 1,
                strokeOpacity: 0.5,
                textDecorationColor: 'white',
              },
            }}
            candleRatio={0.5}
            // Till: (20230327 - Shirley) // candleWidth={8}
            candleColors={{
              positive: TypeOfPnLColorHex.PROFIT,
              negative: TypeOfPnLColorHex.LOSS,
            }}
            data={toCandlestickChartDataRef.current ?? []}
            labels={({datum}) =>
              `O:${datum.open} 　H:${datum.high}　 L:${datum.low}　 C:${datum.close}`
            }
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
                // Till: (20230327 - Shirley) // center={{x: 170, y: -10}}
                x={26}
                y={-10}
                flyoutStyle={{
                  stroke: 'none',
                  fill: '#000000',
                }}
                style={{
                  padding: 0,
                  backgroundColor: '#000000',
                  background: '#000000',
                  fill: LIGHT_GRAY_COLOR,
                  fontFamily: 'barlow',
                  fontSize: 14,

                  /*  Till: (20230327 - Shirley) it works but it's not as designed 
                  fill: (d: any) =>
                    d.datum.close > d.datum.open
                      ? TypeOfPnLColorHex.PROFIT
                      : TypeOfPnLColorHex.LOSS,
                  padding: 8,
                  letterSpacing: 0.5,
                  */
                }}
                pointerLength={0}
                pointerWidth={0}
              />
            }
            /* Till: (20230327 - Shirley)
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={({datum}) =>
                    `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
                  }
                  labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
                />
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onMouseOver: () => ({
                     // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                      target: 'openLabels',
                      mutation: () => ({active: true}),
                    }),
                    onMouseOut: () => ({
                     // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                      target: 'openLabels',
                      mutation: () => ({active: false}),
                    }),
                  },
                },
              ]}
            */
          />
        )}

        {lineGraphOn && (
          <VictoryLine
            animate={{
              duration: 0,
              onEnter: {
                duration: 100,
                before(datum, index, data) {
                  return {y: datum._y1, _y1: datum._y0};
                },
              },
            }}
            style={{
              data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
            }}
            data={toLineChartDataRef.current ?? []}
          />
        )}

        <VictoryLine
          /* Till: (20230327 - Shirley)
            animate={{
              duration: 1000,
            }}
          */
          style={{
            data: {stroke: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME, strokeWidth: 1},
          }}
          data={toLatestPriceLineDataRef.current ?? []}
        />

        <VictoryScatter
          data={toLatestPriceLineDataRef.current ?? []}
          style={{
            data: {
              fill: ({datum}) =>
                datum.x ===
                toLatestPriceLineDataRef?.current[toLatestPriceLineDataRef?.current?.length - 1].x
                  ? 'transparent'
                  : 'transparent',
            },
            labels: {
              opacity: 0.5,
              fill: 'transparent',
            },
          }}
          labels={({datum}) =>
            datum.x ===
            toLatestPriceLineDataRef?.current[toLatestPriceLineDataRef?.current?.length - 1].x
              ? `${datum.y}`
              : ``
          }
          labelComponent={
            <VictoryLabel
              x={Number(candlestickChartWidth) - 28}
              style={{
                fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
                fontSize: 10,
              }}
              backgroundStyle={{fill: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME}}
              backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}}
            />
          }
        />

        {/* TODO: (20230313 - Shirley) 
        {/* {userLine} */}
        {/* {userLines}
        {userPricePoint} */}
        {/* <VictoryLine
          style={{
            data: {stroke: EXAMPLE_BLUE_COLOR, strokeWidth: 1, strokeDasharray: '2,2'},
            // parent: {border: '1px solid #ccc'},
          }}
          data={userOpenPriceLine}
          // data={new Array(30)
          //   .fill(0)
          //   .map((v, index) => {
          //     return {
          //       x: new Date(new Date().getTime() - index * 1000),
          //       y: 10000,
          //     };
          //   })
          //   .reverse()}
        /> 
        */}
        {/* TODO: User open position line on charts (20230310 - Shirley)  */}
        {/* {userCtx.enableServiceTerm && userCtx.openCFDs.length > 0 && showPositionLabel ? (
          <VictoryLine
            style={{
              data: {
                stroke: LINE_GRAPH_STROKE_COLOR.LONG,
                strokeWidth: 1,
                strokeDasharray: '2,2',
              },
            }}
            data={userOpenPriceLine}
          />
        ) : null} */}

        {/* {userCtx.enableServiceTerm && userCtx.openCFDs.length > 0 && showPositionLabel ? (
          <VictoryScatter
            style={{data: {fill: 'transparent'}, labels: {background: 'transparent'}}}
            data={userOpenPriceLine}
            labels={({datum}) =>
              datum.x === userOpenPriceLine[userOpenPriceLine.length - 1].x
                ? ` ⤊ Position $${datum.y.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}　Close`
                : ``
            }
            labelComponent={
              <VictoryLabel
                className="hover:cursor-pointer hover:opacity-80"
                events={{
                  onClick: e => {
                    // Till: (20230327 - Shirley)  // console.log(e.clientX, e.clientY);
                    globalCtx.visiblePositionClosedModalHandler();
                  },
                }}
                x={Number(candlestickChartWidth) - 120}
                style={{
                  fill: LINE_GRAPH_STROKE_COLOR.DEFAULT,
                  fontSize: 12,
                  fontFamily: 'barlow',
                }}
                backgroundStyle={{
                  fill: LINE_GRAPH_STROKE_COLOR.LONG,
                }}
                backgroundPadding={{top: 8, bottom: 5, left: 5, right: 5}}
              />
            }
          />
        ) : null} */}
      </VictoryChart>
    ) : (
      <p>Loading</p>
    );

  return (
    <>
      <div className="-ml-5" style={{width: '70%'}}>
        {/* TODO: (20230310 - Shirley) SVG location 
          <Lottie className="latestPrice" animationData={spotAnimation} /> 
          <div ref={lottieContainerRef} className="z-50 w-50px text-cuteBlue1">
          <p>lottie</p>
          {View}
        </div>{' '} */}

        {isDisplayedCharts}
      </div>
    </>
  );
}
