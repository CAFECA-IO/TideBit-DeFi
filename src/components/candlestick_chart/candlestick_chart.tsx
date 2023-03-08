/*eslint-disable no-console */
import React, {useState, useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import ApexCharts, {ApexOptions} from 'apexcharts';
import {
  EXAMPLE_BLUE_COLOR,
  LIGHT_GRAY_COLOR,
  LINE_GRAPH_STROKE_COLOR,
  TRADING_CHART_BORDER_COLOR,
  TypeOfPnLColorHex,
} from '../../constants/display';
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from 'react-icons/bs';
import {MarketContext, MarketProvider} from '../../contexts/market_context';
import {randomFloatFromInterval, randomIntFromInterval, timestampToString} from '../../lib/common';
import * as V from 'victory';
import {ICandlestickData} from '../../interfaces/tidebit_defi_background/candlestickData';
import useStateRef from 'react-usestateref';
// import {
//   VictoryLabel,
//   VictoryTooltip,
//   VictoryTheme,
//   VictoryLine,
//   VictoryPie,
//   VictoryChart,
//   VictoryAxis,
//   VictoryCandlestick,
// } from 'victory';

// import ReactApexChart from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

interface ITradingChartGraphProps {
  strokeColor: string[];
  candlestickOn: boolean;
  lineGraphOn: boolean;
  // dataArray: number[];
  candlestickChartWidth: string;
  // annotatedValue: number;
  candlestickChartHeight: string;
  // positionDisplayingState: boolean;
}

const chartBlank = 1.68;
const dummyDataSize = 80;
const unitOfLive = 1000;

export interface ILineChartData {
  x: Date;
  y: number | null;
}

// export const getDummyLineData = (n: number) => {
//   const now = new Date().getTime();
//   const nowSecond = now - (now % 1000);

//   const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => {
//     // const y = Math.random() * 100;
//     const y = randomFloatFromInterval(100, 6000, 2);
//     const result: ILineChartData = {
//       x: new Date(nowSecond - (n - i) * 1000),
//       y,
//     };
//     return result;
//   });

//   // add null data
//   const nullDataCount = Math.ceil(n / 1000);
//   for (let i = 0; i < nullDataCount; i++) {
//     // const randomIndex = randomIntFromInterval(0, n - 1);
//     data.push({
//       x: new Date(nowSecond + (n - i) * 1000),
//       y: null,
//     });
//   }

//   return data;
// };

// export const getDummyHorizontalLineData = (n: number) => {
//   const now = new Date().getTime();
//   const nowSecond = now - (now % 1000);

//   const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => ({
//     x: new Date(nowSecond - (n - i) * 1000),
//     y: 5500,
//   }));

//   // // add null data
//   // const nullDataCount = Math.ceil((y / 14) * 5);
//   // for (let i = 0; i < nullDataCount; i++) {
//   //   const randomIndex = randomIntFromInterval(0, y - 1);
//   //   data[randomIndex].y = null;
//   // }

//   return data;
// };

// const dummyLineData = getDummyLineData(50);

// const dummyHorizontalLineData = getDummyHorizontalLineData(80);

export const updateDummyCandlestickChartData = (data: ICandlestickData[]): ICandlestickData[] => {
  const newData = [...data];

  // Generate new data
  const newPoint = newData[newData.length - 2]?.y[3] as number;
  // console.log('new point in update func', newPoint);

  const newYs: (number | null)[] = new Array(4).fill(0).map(v => {
    const rnd = Math.random() / 1.2;
    const ts = rnd > 0.25 ? 1 + rnd ** 5 : 1 - rnd;
    const price = newPoint * ts;

    const prettyPrice = Math.trunc(price * 100) / 100;
    return prettyPrice;
  });

  const newCandlestickData: ICandlestickData = {
    x: new Date(),
    y: newYs,
  };

  // Add new data and remove the first element
  newData.pop(); // remove null data

  newData.shift();

  newData.push(newCandlestickData);
  newData.push({
    x: new Date(),
    y: [null, null, null, null],
  }); // add null data back

  return newData;
};

/**
 *
 * @param
 * @returns `candlestickData`- dataObject:nullObject = 9:5
 */

export default function CandlestickChart({
  strokeColor,
  candlestickOn,
  lineGraphOn,
  candlestickChartWidth,
  candlestickChartHeight,
  ...otherProps
}: ITradingChartGraphProps): JSX.Element {
  const marketCtx = useContext(MarketContext);
  // const candlestickChartRef = useRef<HTMLDivElement>(null);
  const candlestickChartDataFromCtx =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const isCandlestickDataEmpty = candlestickChartDataFromCtx.length === 0;

  const [candlestickChartData, setCandlestickChartData, candlestickChartDataRef] = useStateRef<
    ICandlestickData[] | []
  >(candlestickChartDataFromCtx);

  const [toCandlestickChartData, setToCandlestickChartData, toCandlestickChartDataRef] =
    useStateRef<
      {
        x: Date;
        open: number | null;
        high: number | null;
        low: number | null;
        close: number | null;
      }[]
    >([]);
  // () =>
  // candlestickChartDataFromCtx?.map(data => ({
  //   x: data.x,
  //   open: data.y[0],
  //   high: data.y[1],
  //   low: data.y[2],
  //   close: data.y[3],
  //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  // }))

  const [toLineChartData, setToLineChartData, toLineChartDataRef] = useStateRef<
    {
      x: Date;
      y: number | null;
    }[]
  >(() =>
    candlestickChartDataFromCtx.map((data, i) => ({
      x: data.x,
      y: data.y[3],
    }))
  );

  const [toLatestPriceLineData, setToLatestPriceLineData, toLatestPriceLineDataRef] = useStateRef<
    | {
        x: Date;
        y: number | null;
      }[]
    | undefined
  >();

  useEffect(() => {
    console.log('update candlestick chart data');

    // TODO: BUt it won't update the chart data
    const setStateInterval = setInterval(() => {
      // setCandlestickChartData(updateDummyCandlestickChartData(candlestickChartDataRef.current));
      const updatedCandlestickChartData = updateDummyCandlestickChartData(
        candlestickChartDataRef.current
      );
      const toCandlestickChartData = updatedCandlestickChartData?.map(data => ({
        x: data.x,
        open: data.y[0],
        high: data.y[1],
        low: data.y[2],
        close: data.y[3],
        // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
      }));
      console.log(
        'to candlestick chart data',
        toCandlestickChartData[toCandlestickChartData.length - 2]
      );
      // setToCandlestickChartData(toCandlestickChartDataTemp);
      setToCandlestickChartData(toCandlestickChartData);

      const toLineChartData = updatedCandlestickChartData.map((data, i) => ({
        x: data.x,
        y: data.y[3],
      }));
      setToLineChartData(toLineChartData);

      const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
      const toLatestPriceLineData = toLineChartData?.map(data => ({
        x: data?.x,
        y: latestPrice,
      }));

      setToLatestPriceLineData(toLatestPriceLineData);
    }, 1000 * 1);

    return () => {
      clearInterval(setStateInterval);
    };
  }, []);

  // TODO: to be continued
  // useEffect(() => {
  //   // const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
  //   //   x: data.x,
  //   //   open: data.y[0],
  //   //   high: data.y[1],
  //   //   low: data.y[2],
  //   //   close: data.y[3],
  //   //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  //   // }));
  //   // setToCandlestickChartData(toCandlestickChartData);

  //   // const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
  //   //   x: data.x,
  //   //   y: data.y[3],
  //   // }));
  //   // setToLineChartData(toLineChartData);

  //   // const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  //   // const toLastestPriceHorizontalLineData = toLineChartData?.map(data => ({
  //   //   x: data?.x,
  //   //   y: latestPrice,
  //   // }));
  //   // setToLatestPriceLineData(toLastestPriceHorizontalLineData);

  //   setCandlestickChartData(
  //     marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : []
  //   );

  //   console.log('useEffect');
  // }, [marketCtx.candlestickChartData]);

  // const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
  //   x: data.x,
  //   open: data.y[0],
  //   high: data.y[1],
  //   low: data.y[2],
  //   close: data.y[3],
  //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  // }));
  // // setToCandlestickChartData(toCandlestickChartDataTemp);

  // const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
  //   x: data.x,
  //   y: data.y[3],
  // }));
  // // setToLineChartData(toLineChartDataTemp);

  // const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  // const toLatestPriceLineData = toLineChartData?.map(data => ({
  //   x: data?.x,
  //   y: latestPrice,
  // }));

  // // setToLatestPriceLineData(toLatestPriceLineDataTemp);

  // const {candlestickChartData} = marketCtx;

  // console.log('candleData', candlestickChartDataFromCtx);

  const updatedCandleData = !isCandlestickDataEmpty
    ? updateDummyCandlestickChartData(candlestickChartDataFromCtx)
    : [];

  // console.log('updatedCandleData', updatedCandleData);

  // const toLineChartData = candlestickChartDataFromCtx.map((data, i) => ({
  //   x: data.x,
  //   y: data.y[3],
  // }));

  // const latestPrice = toLineChartData?.[toLineChartData.length - 2]?.y;
  // const toLastestPriceHorizontalLineData = toLineChartData?.map(data => ({
  //   x: data?.x,
  //   y: latestPrice,
  // }));

  // // TODO: Make sure the OHLC order is correct
  // const toCandlestickChartData = candlestickChartDataFromCtx?.map(data => ({
  //   x: data.x,
  //   open: data.y[0],
  //   high: data.y[1],
  //   low: data.y[2],
  //   close: data.y[3],
  //   // label: JSON.stringify({open: data.y[0], high: data.y[1], low: data.y[2], close: data.y[3]}),
  // }));

  // VictoryThemeDefinition
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          // this changed the color of my numbers to white
          fill: LIGHT_GRAY_COLOR,
          fontSize: 10,
          fontFamily: 'barlow',
          padding: 5,
        },
        axis: {
          stroke: LIGHT_GRAY_COLOR,
          y: {
            stroke: 'white',
            position: 'right',
          },
          position: 'right',
        },
      },
    },
  };

  // console.log('market candlestick data', marketCtx.candlestickChartData);
  // console.log('stringify', JSON.stringify(marketCtx.candlestickChartData));
  // console.log('line data from candlestick chart', toLineChartData);

  // TODO: #WI find the max number in the data array
  // const maxNumber = lineDataFetchedFromContext?.reduce((acc, curr) => {
  //   if (curr.y && curr.y > acc) {
  //     return curr.y;
  //   }
  //   return acc;
  // }, 0);

  // TODO: #WII find the max number in the data array
  // const candlestickData = marketCtx.candlestickChartData;
  // const maxNumber = candlestickData?.reduce((max, item) => {
  //   const maxInY = item.y.reduce((maxY, number) => {
  //     return number > maxY ? number : maxY;
  //   }, 0);
  //   return maxInY > max ? maxInY : max;
  // }, 0);

  const rawCandleData =
    marketCtx.candlestickChartData !== null ? marketCtx.candlestickChartData : [];

  const ys = rawCandleData.flatMap(d => d.y.filter(y => y !== null)) as number[];

  // console.log('ys', ys);

  // const maxNumber = ys.reduce((acc, curr) => {
  //   if (curr.y && curr.y > acc) {
  //     return curr.y;
  //   }

  //   return acc;
  // }, 0);

  const maxNumber = ys.length > 0 ? Math.max(...ys) : null;
  const minNumber = ys.length > 0 ? Math.min(...ys) : null;

  // const largestY = ys && ys.length > 0 ? Math.max(...ys) : undefined;
  // const largestY = ys && ys.reduce((acc, val) => val > acc ? val : acc, -Infinity);

  // const largestY = data.reduce((maxY, candlestick) => {
  //   const currentMaxY = Math.max(...candlestick.y);
  //   return currentMaxY > maxY ? currentMaxY : maxY;
  // }, -Infinity);
  // console.log(largestY);

  // console.log('max number', maxNumber);
  // console.log('min number', minNumber);

  // console.log('position context info in candlestick chart', positionInfoOnChart);

  // console.log('in candlestick chart, showPositionOnChart:', showPositionOnChart);

  const anotherSampleData = [1230, 1272, 1120, 1265, 1342, 1299];

  // TODO: measure the biggest number to decide the y-axis
  // const dataSample = marketCtx.candlestickChartData?.map(data =>
  //   data.y.every(v => v === null) ? null : data
  // );

  // const largestNumber = dataSample.reduce((acc, curr) => {
  //   const largestInRow = curr.y.reduce((rowAcc, rowCurr) => {
  //     if (rowCurr && rowCurr > rowAcc) {
  //       return rowCurr;
  //     }
  //     return rowAcc;
  //   }, 0);

  //   if (largestInRow > acc) {
  //     return largestInRow;
  //   }
  //   return acc;
  // }, 0);

  // const candlestickData = dummyChartData(dummyDataSize);
  // console.log('data length', candlestickData.length);

  // console.log('positionDisplayingState', positionDisplayingState);
  // const [showPosition, setShowPosition] = useState<boolean>(positionDisplayingState);

  // console.log('showPositionOnChart in chart component', showPositionOnChart);

  // let data = '';

  const chartOptionsWithPositionLabel: ApexOptions = {
    // series: [
    //   {
    //     name: 'candles',
    //     type: 'candlestick',
    //     data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
    //   },
    //   {
    //     name: 'line',
    //     type: 'line',
    //     data: dummyLineData,
    //     // [
    //     //   {
    //     //     x: new Date().getTime() - 1000,
    //     //     y: 5500,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 500,
    //     //     y: 4602,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 200,
    //     //     y: 7607,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 100,
    //     //     y: 4920,
    //     //   },
    //     // ],
    //   },
    // ],

    chart: {
      // id: candlestickChartIdHandler(id),
      background: '#FFFFFF',

      id: 'candles',
      type: 'candlestick',
      height: 0,

      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },

      // dropShadow: {
      //   enabled: true,
      //   top: 0,
      //   left: 0,
      //   blur: 3,
      //   opacity: 0.5,
      // },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          candlestick: {
            width: '1000',
          },
        },
      },
    ],
    // title: {
    //   // Candlestick chart 24 hr volume TODO: it works but needs to adjust the position (to be exact, the width of the chart)
    //   text: `24h Volume ${marketCtx.selectedTicker?.tradingVolume ?? 999} USDT`,
    //   align: 'left',
    //   style: {
    //     fontSize: '14px',
    //     fontWeight: 'bold',
    //     fontFamily: 'barlow',
    //     color: LIGHT_GRAY_COLOR,
    //   },
    // },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: false,
      // show: true,
      // yaxis: {
      //   lines: {show: false},
      // },
      // xaxis: {
      //   lines: {show: false},
      // },
      // padding: {
      //   right: 300,
      // },
    },

    // TODO: min and max in yaxis
    yaxis: {
      // min(min) {
      //   return min - 0.1;
      // },
      tooltip: {
        enabled: true,
      },
      labels: {
        show: true,
        align: 'center',
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      opposite: true,
      axisBorder: {
        show: true,
        color: TRADING_CHART_BORDER_COLOR,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: 'dark',
    },

    plotOptions: {
      candlestick: {
        colors: {
          upward: TypeOfPnLColorHex.PROFIT,
          downward: TypeOfPnLColorHex.LOSS,
        },
        wick: {
          useFillColor: true,
        },
      },
    },

    // markers: {
    //   discrete: [
    //     {
    //       seriesIndex: 0,
    //       dataPointIndex: dataArray.length - 1,
    //       size: 1,
    //       strokeColor: strokeColor[0],
    //       shape: 'circle',
    //     },
    //   ],
    // },
    // grid: {
    //   show: true,
    //   borderColor: strokeColor[0],
    //   strokeDashArray: 5,
    //   position: 'back',
    // },
    // forecastDataPoints: {
    //   count: 2,
    //   fillOpacity: 0.5,
    //   dashArray: 2,
    // },
    annotations: {
      // position: 'back',
      yaxis: [
        {
          y: 1800,
          strokeDashArray: 3,
          borderColor: TypeOfPnLColorHex.LOSS,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 2,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.LOSS,
              padding: {
                right: 10,
              },
            },
            text: `Position $1800 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 3500,
          strokeDashArray: 3,
          borderColor: TypeOfPnLColorHex.PROFIT,
          width: '100%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 2,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.PROFIT,
              padding: {
                right: 10,
              },
            },
            text: `Position $3500 Close`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
        {
          y: 3000,
          strokeDashArray: 0,
          borderColor: TypeOfPnLColorHex.TIDEBIT_THEME,
          width: '105%',
          fillColor: '#ffffff',

          label: {
            position: 'right',
            borderColor: 'transparent',
            textAnchor: 'end',
            offsetY: 10,
            offsetX: 42,
            style: {
              color: '#ffffff',
              fontSize: '12px',
              background: TypeOfPnLColorHex.TIDEBIT_THEME,
              padding: {
                left: -5,
                right: 20,
              },
            },
            text: `$3000`,
            borderWidth: 20,
          },

          offsetX: 0,
        },
      ],
    },
  };

  const lineChartOptions: ApexOptions = {
    chart: {
      // id: candlestickChartIdHandler(id),
      background: EXAMPLE_BLUE_COLOR,
      id: 'lineGraph',
      type: 'line',
      height: 0,

      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
      animations: {
        enabled: false,
      },

      // // TODO: realtime updated chart needs `useEffect` to renew the data series
      // animations: {
      //   enabled: true,
      //   easing: 'linear',
      //   dynamicAnimation: {
      //     speed: 1000,
      //   },
      // },

      // dropShadow: {
      //   enabled: true,
      //   top: 0,
      //   left: 0,
      //   blur: 3,
      //   opacity: 0.5,
      // },
    },

    stroke: {
      show: true,
      curve: 'straight',
      lineCap: 'butt',
      colors: [LINE_GRAPH_STROKE_COLOR.DEFAULT],
      width: 1.5,
      dashArray: 0,
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          // candlestick: {
          //   width: '1000',
          // },
        },
      },
    ],
    // title: {
    //   text: 'Line graph 24 hr volume',
    //   align: 'left',
    //   style: {
    //     fontSize: '14px',
    //     fontWeight: 'bold',
    //     fontFamily: 'barlow',
    //     color: LINE_GRAPH_STROKE_COLOR.DEFAULT,
    //   },
    // },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true, // TODO: show xaxis labels
        style: {
          colors: TRADING_CHART_BORDER_COLOR,
        },
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: false,
      // show: true,
      // yaxis: {
      //   lines: {show: false},
      // },
      // xaxis: {
      //   lines: {show: false},
      // },
      // padding: {
      //   right: 300,
      // },
    },

    // TODO: min and max in yaxis
    yaxis: {
      tooltip: {
        enabled: false,
      },
      labels: {
        show: true, // TODO: show yaxis labels
        align: 'center',
        style: {
          colors: EXAMPLE_BLUE_COLOR,
        },
      },
      opposite: true,
      axisBorder: {
        show: true,
        color: TRADING_CHART_BORDER_COLOR,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
      fillSeriesColor: false,
      theme: 'dark',
    },

    // markers: {
    //   discrete: [
    //     {
    //       seriesIndex: 0,
    //       dataPointIndex: dataArray.length - 1,
    //       size: 1,
    //       strokeColor: strokeColor[0],
    //       shape: 'circle',
    //     },
    //   ],
    // },
    // grid: {
    //   show: true,
    //   borderColor: strokeColor[0],
    //   strokeDashArray: 5,
    //   position: 'back',
    // },
    // forecastDataPoints: {
    //   count: 2,
    //   fillOpacity: 0.5,
    //   dashArray: 2,
    // },
    // annotations: {
    //   // position: 'back',
    //   yaxis: [
    //     {
    //       y: 1800,
    //       strokeDashArray: 3,
    //       borderColor: TypeOfPnLColorHex.LOSS,
    //       width: '100%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 2,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: TypeOfPnLColorHex.LOSS,
    //           padding: {
    //             right: 10,
    //           },
    //         },
    //         text: `Position $1800 Close`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //     {
    //       y: 3500,
    //       strokeDashArray: 3,
    //       borderColor: TypeOfPnLColorHex.PROFIT,
    //       width: '100%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 2,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: TypeOfPnLColorHex.PROFIT,
    //           padding: {
    //             right: 10,
    //           },
    //         },
    //         text: `Position $3500 Close`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //     {
    //       y: 3000,
    //       strokeDashArray: 0,
    //       borderColor: TypeOfPnLColorHex.TIDEBIT_THEME,
    //       width: '105%',
    //       fillColor: '#ffffff',

    //       label: {
    //         position: 'right',
    //         borderColor: 'transparent',
    //         textAnchor: 'end',
    //         offsetY: 10,
    //         offsetX: 42,
    //         style: {
    //           color: '#ffffff',
    //           fontSize: '12px',
    //           background: TypeOfPnLColorHex.TIDEBIT_THEME,
    //           padding: {
    //             left: -5,
    //             right: 20,
    //           },
    //         },
    //         text: `$3000`,
    //         borderWidth: 20,
    //       },

    //       offsetX: 0,
    //     },
    //   ],
    // },
  };

  // const chartOptionsWithoutPositionLabel: ApexOptions = {
  //   // series
  //   chart: {
  //     type: 'candlestick',
  //     height: 0,

  //     toolbar: {
  //       show: false,
  //       tools: {
  //         zoom: false,
  //         zoomin: false,
  //         zoomout: false,
  //         pan: false,
  //       },
  //     },

  //     // dropShadow: {
  //     //   enabled: true,
  //     //   top: 0,
  //     //   left: 0,
  //     //   blur: 3,
  //     //   opacity: 0.5,
  //     // },
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 500,
  //       options: {
  //         candlestick: {
  //           width: '1000',
  //         },
  //       },
  //     },
  //   ],
  //   title: {
  //     text: '',
  //     align: 'left',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     labels: {
  //       style: {
  //         colors: TRADING_CHART_BORDER_COLOR,
  //       },
  //     },
  //     axisTicks: {
  //       show: false,
  //     },
  //   },
  //   grid: {
  //     show: false,
  //     // show: true,
  //     // yaxis: {
  //     //   lines: {show: false},
  //     // },
  //     // xaxis: {
  //     //   lines: {show: false},
  //     // },
  //     // padding: {
  //     //   right: 300,
  //     // },
  //   },

  //   yaxis: {
  //     tooltip: {
  //       enabled: true,
  //     },
  //     labels: {
  //       show: true,
  //       align: 'center',
  //       style: {
  //         colors: TRADING_CHART_BORDER_COLOR,
  //       },
  //     },
  //     opposite: true,
  //     axisBorder: {
  //       show: true,
  //       color: TRADING_CHART_BORDER_COLOR,
  //     },
  //     axisTicks: {
  //       show: false,
  //     },
  //   },
  //   tooltip: {
  //     enabled: true,
  //     fillSeriesColor: false,
  //     theme: 'dark',
  //   },

  //   plotOptions: {
  //     candlestick: {
  //       colors: {
  //         upward: TypeOfPnLColorHex.PROFIT,
  //         downward: TypeOfPnLColorHex.LOSS,
  //       },
  //       wick: {
  //         useFillColor: true,
  //       },
  //     },
  //   },

  //   // markers: {
  //   //   discrete: [
  //   //     {
  //   //       seriesIndex: 0,
  //   //       dataPointIndex: dataArray.length - 1,
  //   //       size: 1,
  //   //       strokeColor: strokeColor[0],
  //   //       shape: 'circle',
  //   //     },
  //   //   ],
  //   // },
  //   // grid: {
  //   //   show: true,
  //   //   borderColor: strokeColor[0],
  //   //   strokeDashArray: 5,
  //   //   position: 'back',
  //   // },
  //   // forecastDataPoints: {
  //   //   count: 2,
  //   //   fillOpacity: 0.5,
  //   //   dashArray: 2,
  //   // },
  //   annotations: {
  //     // position: 'back',
  //     yaxis: [
  //       {
  //         y: 3000,
  //         strokeDashArray: 0,
  //         borderColor: TypeOfPnLColorHex.TIDEBIT_THEME,
  //         width: '105%',
  //         fillColor: '#ffffff',

  //         label: {
  //           position: 'right',
  //           borderColor: 'transparent',
  //           textAnchor: 'end',
  //           offsetY: 10,
  //           offsetX: 42,
  //           style: {
  //             color: '#ffffff',
  //             fontSize: '12px',
  //             background: TypeOfPnLColorHex.TIDEBIT_THEME,
  //             padding: {
  //               left: -5,
  //               right: 20,
  //             },
  //           },
  //           text: `$3000`,
  //           borderWidth: 20,
  //         },

  //         offsetX: 0,
  //       },
  //     ],
  //   },
  // };

  // const displayedPosition = chartOptionsWithPositionLabel;

  // const displayedPosition = showPositionOnChart
  //   ? chartOptionsWithPositionLabel
  //   : chartOptionsWithoutPositionLabel;

  // console.log('showPosition state:', showPositionOnChart);
  // console.log('display option:', displayedPosition.annotations.yaxis[0].label.text);

  const [lineChart, setLineChart] = useState({
    options: lineChartOptions,
  });

  const [candleChart, setCandleChart] = useState({
    options: chartOptionsWithPositionLabel,
    toolbar: {
      show: false,
      enabled: false,
    },
    // series: [
    //   {
    //     name: 'candles',
    //     type: 'candlestick',
    //     data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
    //   },
    //   {
    //     name: 'line',
    //     type: 'line',
    //     data: dummyLineData,
    //     // [
    //     //   {
    //     //     x: new Date().getTime() - 1000,
    //     //     y: 5500,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 500,
    //     //     y: 4602,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 200,
    //     //     y: 7607,
    //     //   },
    //     //   {
    //     //     x: new Date().getTime() - 100,
    //     //     y: 4920,
    //     //   },
    //     // ],
    //   },
    // ],
    // {
    //   name: 'series-1',
    //   data: [],
    // },
    // {
    //   name: 'series-1',
    //   data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
    // },
  });

  // const sampleDataDates = [
  //   {x: new Date(2016, 6, 1), open: 5, close: 10, high: 15, low: 0},
  //   {x: new Date(2016, 6, 2), open: 10, close: 15, high: 20, low: 5},
  //   {x: new Date(2016, 6, 3), open: 15, close: 20, high: 22, low: 10},
  //   {x: new Date(2016, 6, 4), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 5), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 6), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 7), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 8), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 9), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 10), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 11), open: 20, close: 10, high: 25, low: 7},
  //   {x: new Date(2016, 6, 5), open: 10, close: 8, high: 15, low: 5},
  // ];

  // useEffect(() => {
  //   if (marketCtx.candlestickChartData === null) {
  //     <p>Loading</p>;
  //   }
  // }, [marketCtx.candlestickChartData]);

  return (
    <>
      {/* w-2/3 xl:w-4/5 */}
      {/* TODO: Temporary adjustment of chart size */}
      <div className="-ml-5" style={{width: '70%'}}>
        {/* <VictoryCandlestick
          // candleWidth={55}
          data={sampleDataDates}
          // data={marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : []}
        /> */}
        {!isCandlestickDataEmpty ? (
          <V.VictoryChart
            // animate={{duration: 300}}
            // chartTheme
            theme={chartTheme}
            minDomain={{y: minNumber !== null ? minNumber * 0.95 : undefined}}
            maxDomain={{y: maxNumber !== null ? maxNumber * 1.05 : undefined}} // TODO: measure the biggest number to decide the y-axis
            // domainPadding={{x: 1}}
            scale={{x: 'time'}}
            width={Number(candlestickChartWidth)}
            height={Number(candlestickChartHeight)}
            // containerComponent={
            //   <V.VictoryVoronoiContainer
            //     voronoiDimension="x"
            //     labels={({datum}) =>
            //       `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
            //     }
            //     labelComponent={<V.VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
            //   />
            // }
          >
            <V.VictoryAxis
              // width={Number(candlestickChartWidth)}
              style={
                {
                  // ticks: {color: 'white'},
                  // axisLabel: {fontColor: 'white'},
                  // tickLabels: {fontColor: 'white'},
                }
              }
              tickFormat={t => ` ${timestampToString(t / 1000).time}`}
            />
            <V.VictoryAxis
              // axisLabelComponent={<V.VictoryLabel dy={-20} />}
              // offsetX={600}
              offsetX={Number(candlestickChartWidth) / 1.08}
              dependentAxis
              // tickLabelComponent={<V.VictoryLabel verticalAnchor="start" textAnchor="start" x={0} />}
            />

            {candlestickOn && (
              <V.VictoryCandlestick
                animate={{
                  onExit: {
                    duration: 300,
                    before(datum, index, data) {
                      return {y: datum._y1, _y1: datum._y0};
                    },
                  },
                }}
                style={{
                  data: {
                    // fill: '#c43a31',
                    // fill: 'none',
                    fillOpacity: 1,
                    // stroke: '#c43a31',
                    // VictoryCandlestickStyleInterface["data"]
                    stroke: (d: any) =>
                      d.close > d.open ? TypeOfPnLColorHex.LOSS : TypeOfPnLColorHex.PROFIT,
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                    textDecorationColor: 'white',
                  },
                }}
                // style={{close: {stroke: 'black'}, open: {stroke: 'black'}}}
                // labelOrientation={{
                //   close: 'right',
                //   open: 'right',
                //   high: 'top',
                //   low: 'bottom',
                // }}
                // padding={{top: 0, bottom: 0, left: 20, right: 0}}
                // candleWidth={10}
                candleRatio={0.5}
                candleColors={{
                  positive: TypeOfPnLColorHex.PROFIT,
                  negative: TypeOfPnLColorHex.LOSS,
                }}
                data={toCandlestickChartDataRef.current}
                // openLabels
                // openLabelComponent={<V.VictoryTooltip pointerLength={10} />}

                labels={({datum}) =>
                  `open: ${datum.open}\nhigh: ${datum.high}\nlow: ${datum.low}\nclose: ${datum.close}`
                }
                labelComponent={
                  <V.VictoryTooltip
                    style={{
                      fontFamily: 'barlow',
                      fontSize: 12,
                      // fontWeight: 500,
                      // stroke: 'black',
                      // backgroundColor: EXAMPLE_BLUE_COLOR,
                      // borderBlockColor: EXAMPLE_BLUE_COLOR,
                      // borderColor: EXAMPLE_BLUE_COLOR,

                      fill: (d: any) =>
                        d.datum.close > d.datum.open
                          ? TypeOfPnLColorHex.PROFIT
                          : TypeOfPnLColorHex.LOSS,
                      padding: 8,
                      letterSpacing: 0.5,
                    }}
                    // text={'white'}
                    // theme={chartTheme}
                    // pointerWidth={50}
                    pointerLength={10}
                    // pointerOrientation={'top'}
                  />
                }

                // containerComponent={
                //   <V.VictoryVoronoiContainer
                //     voronoiDimension="x"
                //     labels={({datum}) =>
                //       `open: ${datum.open} high: ${datum.high} low: ${datum.low} close: ${datum.close}`
                //     }
                //     labelComponent={<V.VictoryTooltip cornerRadius={2} flyoutStyle={{fill: 'black'}} />}
                //   />
                // }

                // events={[
                //   {
                //     target: 'data',
                //     eventHandlers: {
                //       onMouseOver: () => ({
                //         // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                //         target: 'openLabels',
                //         mutation: () => ({active: true}),
                //       }),
                //       onMouseOut: () => ({
                //         // target: ['lowLabels', 'highLabels', 'openLabels', 'closeLabels'],
                //         target: 'openLabels',
                //         mutation: () => ({active: false}),
                //       }),
                //     },
                //   },
                // ]}
              />
            )}

            {lineGraphOn && (
              <V.VictoryLine
                animate={{
                  onEnter: {
                    duration: 300,
                    before(datum, index, data) {
                      return {y: datum._y1, _y1: datum._y0};
                    },
                  },
                }}
                style={{
                  data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
                  // parent: {border: '1px solid #ccc'},
                }}
                // events={{
                //   () => {console.log('hi')}
                //   // onClick: (evt) => alert(`(${evt.clientX}, ${evt.clientY})`)
                // }}
                // events={[
                //   {
                //     target: 'data',
                //     eventHandlers: {
                //       // onClick: () => {
                //       //   console.log('line graph');
                //       // },
                //       // NOT working in line graph
                //       // onMouseOver: () => ({
                //       //   target: 'data',
                //       //   mutation: () => ({active: true}),
                //       // }),
                //       // onMouseOut: () => ({
                //       //   target: 'data',
                //       //   mutation: () => ({active: false}),
                //       // }),
                //     },
                //   },
                // ]}
                data={toLineChartDataRef.current}
                // data={toLineChartData ? [...toLineChartData] : []}
              />
            )}

            {/* {!candlestickOn && !lineGraphOn && (
            <V.VictoryLine
              style={{
                data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
                // parent: {border: '1px solid #ccc'},
              }}
              data={lastestPriceHorizontalLineData}
            />
          )} */}

            <V.VictoryLine
              animate={{
                onExit: {
                  duration: 300,
                  before(datum, index, data) {
                    return {y: datum._y1, _y1: datum._y0};
                  },
                },
              }}
              style={{
                data: {stroke: LINE_GRAPH_STROKE_COLOR.TIDEBIT_THEME, strokeWidth: 1},
                // parent: {border: '1px solid #ccc'},
              }}
              data={toLatestPriceLineDataRef.current}
            />
          </V.VictoryChart>
        ) : (
          <p>Loading</p>
        )}

        {/* ----------Candlestick chart---------- */}
        {/* TODO: draw three svg in total to separate the functionality */}
        {/* <Chart
          options={candleChart.options}
          // series={apexData.series}
          series={[
            {
              name: 'candles',
              type: 'candlestick',
              data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
            },
          ]}
          type="candlestick"
          width={candlestickChartWidth}
          height={candlestickChartHeight}
        /> */}
        {/* {candlestickOn && (
          <Chart
            options={candleChart.options}
            // series={apexData.series}
            series={[
              {
                name: 'candles',
                type: 'candlestick',
                data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
              },
            ]}
            type="candlestick"
            width={candlestickChartWidth}
            height={candlestickChartHeight}
          />
        )} */}
      </div>

      <div className="relative">
        <div className="">
          {/* <VictoryCandlestick
          // candleWidth={55}
          data={sampleDataDates}
          // data={marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : []}
        /> */}
          {/* <VictoryChart
            // theme={VictoryTheme.material}
            // domainPadding={{x: 1}}
            scale={{x: 'time'}}
            width={Number(candlestickChartWidth) / 2}
            height={Number(candlestickChartHeight) / 2}
          >
            <VictoryAxis
              // width={Number(candlestickChartWidth)}
              style={{axisLabel: {fontColor: 'white'}}}
              tickFormat={
                // t => `${t.toLocaleTimeString().split(' ')[0]}`
                t =>
                  `${t.getYear()}/${t.getDate()}/${t.getMonth()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
              }
            />
            <VictoryAxis dependentAxis />
            <VictoryCandlestick
              style={{
                data: {
                  // fill: '#c43a31',
                  // fill: 'none',
                  fillOpacity: 1,
                  // stroke: '#c43a31',
                  // VictoryCandlestickStyleInterface["data"]
                  stroke: (d: any) =>
                    d.close > d.open ? TypeOfPnLColorHex.LOSS : TypeOfPnLColorHex.PROFIT,
                  strokeWidth: 1,
                  strokeOpacity: 0.5,
                },
              }}
              // style={{close: {stroke: 'black'}, open: {stroke: 'black'}}}

              candleColors={{positive: TypeOfPnLColorHex.PROFIT, negative: TypeOfPnLColorHex.LOSS}}
              data={transformedCandlestickData}
              // lowLabels
              // lowLabelComponent={<VictoryTooltip pointerLength={0} />}
              // highLabels
              // highLabelComponenet={<VictoryTooltip pointerLength={0} />}
              openLabels
              openLabelComponent={<VictoryTooltip pointerLength={0} />}
              // closeLabels
              closeLabelComponent={<VictoryTooltip pointerLength={0} />}
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
            />
            {lineGraphOn && (
              <VictoryLine
                style={{
                  data: {stroke: LINE_GRAPH_STROKE_COLOR.DEFAULT, strokeWidth: 1},
                  // parent: {border: '1px solid #ccc'},
                }}
                // events={{
                //   () => {console.log('hi')}
                //   // onClick: (evt) => alert(`(${evt.clientX}, ${evt.clientY})`)
                // }}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      // onClick: () => {
                      //   console.log('line graph');
                      // },
                      // NOT working in line graph
                      // onMouseOver: () => ({
                      //   target: 'data',
                      //   mutation: () => ({active: true}),
                      // }),
                      // onMouseOut: () => ({
                      //   target: 'data',
                      //   mutation: () => ({active: false}),
                      // }),
                    },
                  },
                ]}
                data={lineDataFetchedFromContext ? [...lineDataFetchedFromContext] : []}
              />
            )}
          </VictoryChart>{' '} */}
          {/* ----------Candlestick chart---------- */}
          {/* TODO: draw three svg in total to separate the functionality */}
          {/* <Chart
          options={candleChart.options}
          // series={apexData.series}
          series={[
            {
              name: 'candles',
              type: 'candlestick',
              data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
            },
          ]}
          type="candlestick"
          width={candlestickChartWidth}
          height={candlestickChartHeight}
        /> */}
          {/* {candlestickOn && (
          <Chart
            options={candleChart.options}
            // series={apexData.series}
            series={[
              {
                name: 'candles',
                type: 'candlestick',
                data: marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : [],
              },
            ]}
            type="candlestick"
            width={candlestickChartWidth}
            height={candlestickChartHeight}
          />
        )} */}
        </div>

        {/* <div className="pointer-events-none absolute top-0 ml-0"> */}
        {/* ----------Line chart---------- */}
        {/* {lineGraphOn && (
          <Chart
            options={lineChart.options}
            series={[
              {
                name: 'line',
                type: 'line',
                data: lineDataFetchedFromContext ? [...lineDataFetchedFromContext] : [],

                // data: dummyLineData,
              },
              // {
              //   name: 'horizontal line',
              //   type: 'line',
              //   data: dummyHorizontalLineData,
              //   // data: [{x: new Date().getTime() - 1000, y: 5500}],
              // },
            ]}
            type="line"
            width={Number(candlestickChartWidth)} // `/1.05` === `*0.95`
            height={Number(candlestickChartHeight)}
            // width={candlestickChartWidth}
            // height={candlestickChartHeight}
          />
        )}
      </div> */}

        {/* <MarketContext.Consumer>
        {({showPositionOnChart}) => {
          console.log('showPositionOnChart in chart rendering: ', showPositionOnChart);
          return (
            <Chart
              options={dataSample.options}
              series={dataSample.series}
              type="candlestick"
              width={candlestickChartWidth}
              height={candlestickChartHeight}
            />
          );
        }}
      </MarketContext.Consumer> */}
      </div>
    </>
  );
}
