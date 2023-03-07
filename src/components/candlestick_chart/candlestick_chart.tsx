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
import {randomFloatFromInterval, randomIntFromInterval} from '../../lib/common';
import {
  VictoryLabel,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
} from 'victory';

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

export const getDummyLineData = (n: number) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % 1000);

  const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => {
    // const y = Math.random() * 100;
    const y = randomFloatFromInterval(100, 6000, 2);
    const result: ILineChartData = {
      x: new Date(nowSecond - (n - i) * 1000),
      y,
    };
    return result;
  });

  // add null data
  const nullDataCount = Math.ceil(n / 1000);
  for (let i = 0; i < nullDataCount; i++) {
    // const randomIndex = randomIntFromInterval(0, n - 1);
    data.push({
      x: new Date(nowSecond + (n - i) * 1000),
      y: null,
    });
  }

  return data;
};

export const getDummyHorizontalLineData = (n: number) => {
  const now = new Date().getTime();
  const nowSecond = now - (now % 1000);

  const data: ILineChartData[] = new Array(n).fill(0).map((v, i) => ({
    x: new Date(nowSecond - (n - i) * 1000),
    y: 5500,
  }));

  // // add null data
  // const nullDataCount = Math.ceil((y / 14) * 5);
  // for (let i = 0; i < nullDataCount; i++) {
  //   const randomIndex = randomIntFromInterval(0, y - 1);
  //   data[randomIndex].y = null;
  // }

  return data;
};

const dummyLineData = getDummyLineData(50);

const dummyHorizontalLineData = getDummyHorizontalLineData(80);

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

  const lineDataFetchedFromContext = marketCtx.candlestickChartData?.map((data, i) => ({
    x: data.x,
    y: data.y[0],
  }));

  const transformedCandlestickData = marketCtx.candlestickChartData?.map(data => ({
    x: data.x,
    open: data.y[0],
    high: data.y[1],
    low: data.y[2],
    close: data.y[3],
  }));

  // VictoryThemeDefinition
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          // this changed the color of my numbers to white
          fill: 'white',
          fontSize: 10,
          padding: 5,
        },
        axis: {
          stroke: 'white',
          y: {
            stroke: 'white',
            position: 'right',
          },
          position: 'right',
        },
      },
    },
  };

  // const {showPositionOnChart, positionInfoOnChart, candlestickChartIdHandler} =
  //   useContext(MarketContext);
  console.log('market candlestick data', marketCtx.candlestickChartData);
  // console.log('stringify', JSON.stringify(marketCtx.candlestickChartData));
  console.log('line data from candlestick chart', lineDataFetchedFromContext);
  // console.log('line data', dummyLineData);

  // console.log('position context info in candlestick chart', positionInfoOnChart);

  // console.log('in candlestick chart, showPositionOnChart:', showPositionOnChart);

  const anotherSampleData = [1230, 1272, 1120, 1265, 1342, 1299];

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

  // useEffect(() => {
  //   // let chart = new ApexCharts(el, options);
  //   ApexCharts.exec('candles', 'updateOptions', displayedPosition);
  // }, [showPositionOnChart]);

  // useEffect(() => {
  //   setDataSample({
  //     options: displayedPosition,
  //     toolbar: {show: false, enabled: false},
  //     series: [
  //       {
  //         name: 'series-1',
  //         data: [...candlestickData],
  //       },
  //     ],
  //   });
  // }, []);

  // setDataSample({
  //   options: displayedPosition,
  // });

  // const displayedChart = showPositionOnChart ? () : ()

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

  return (
    <>
      {/* w-2/3 xl:w-4/5 */}
      <div className="">
        {/* <VictoryCandlestick
          // candleWidth={55}
          data={sampleDataDates}
          // data={marketCtx.candlestickChartData ? [...marketCtx.candlestickChartData] : []}
        /> */}
        <VictoryChart
          // chartTheme
          theme={chartTheme}
          // domainPadding={{x: 1}}
          scale={{x: 'time'}}
          width={Number(candlestickChartWidth)}
          height={Number(candlestickChartHeight)}
        >
          <VictoryAxis
            // width={Number(candlestickChartWidth)}
            style={
              {
                // ticks: {color: 'white'},
                // axisLabel: {fontColor: 'white'},
                // tickLabels: {fontColor: 'white'},
              }
            }
            tickFormat={
              // t => `${t.toLocaleTimeString().split(' ')[0]}`
              t =>
                `${t.getYear()}/${t.getDate()}/${t.getMonth()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
            }
          />
          <VictoryAxis
            dependentAxis
            tickLabelComponent={<VictoryLabel verticalAnchor="start" textAnchor="start" x={0} />}
          />
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
                textDecorationColor: 'white',
              },
            }}
            // style={{close: {stroke: 'black'}, open: {stroke: 'black'}}}
            labelOrientation={{
              close: 'right',
              open: 'right',
              high: 'top',
              low: 'bottom',
            }}
            candleColors={{positive: TypeOfPnLColorHex.PROFIT, negative: TypeOfPnLColorHex.LOSS}}
            data={transformedCandlestickData}
            // labels={({datum}) => `open: ${datum.open}`}
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
        </VictoryChart>{' '}
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
